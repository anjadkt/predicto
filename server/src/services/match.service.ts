import { Match } from "../models/match.model";
import { formatDate, formatTime, utcToIst } from "../utils/formatDate";
import { getMatchesFromApi } from "../utils/getMatchesApi";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import { UserPrediction } from "../models/userPrediction.model";
import { calculatePoints } from "../utils/calcPoints";
import { User } from "../models/user.model";
import { calculateChance } from "../utils/calcChance";
import { Prediction } from "../models/prediction.model";

export const sync = async () => {

    const matchesLive = await Match
        .find({ status: { $nin: ["FINISHED", "POSTPONED", "SUSPENDED", "CANCELLED"] } })
        .select("_id apiMatchId status score")
        .lean();

    const matchIds = new Map();

    if (matchesLive.length > 0) {
        matchesLive.forEach((match) => {
            matchIds.set(match.apiMatchId, {
                _id: match._id,
                status: match.status,
                score: match.score
            });
        });
    }

    const matchesNew = await getMatchesFromApi(matchIds);

    for (const match of matchesNew) {

        await Match.updateOne(
            { apiMatchId: match.id },
            {
                $set: {
                    status: match.status,
                    score: match.score,
                },

                $setOnInsert: {
                    apiMatchId: match.id,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    utcDate: match.utcDate,
                    istDate: utcToIst(match.utcDate),
                    date: formatDate(match.utcDate),
                    time: formatTime(match.utcDate),
                },
            },
            {
                upsert: true
            }
        );
    }
}

export const updateForecast = async (match: any, type: "FINISHED" | "LIVE") => {

    const session = await mongoose.startSession();

    try {

        const isMatchExist = await Match.findById(match.matchId).select("predictionId");
        if (!isMatchExist) {
            throw new AppError(404, "Match not found");
        }

        session.startTransaction();

        let isAllFinished = false;

        if (type === "FINISHED") {

            const prediction = await Prediction
                .findById(isMatchExist.predictionId)
                .populate("matches.matchId", "status")
                .select("matches")
                .session(session);
            if (!prediction) {
                throw new AppError(404, "Prediction not found!");
            }

            isAllFinished = prediction.matches.every(
                (v: any) => v.matchId.status === "FINISHED"
            );

            if (isAllFinished) {
                prediction.status = "COMPLETED";
                await prediction.save({ session });
            }

        }

        const userPredictions = await UserPrediction.find({
            predictionId: isMatchExist.predictionId
        }).session(session);

        const predictionUpdates = [];

        for (const p of userPredictions) {

            const prediction = p.predictions.find(v => v.matchId.toString() === match.matchId.toString());

            if (!prediction) continue;

            const { predictedScores, results } = prediction;

            if (!predictedScores || results?.status === "WRONG") continue;

            let result;

            if (type === "LIVE") {
                const chance = calculateChance(predictedScores, match.score);

                result = {
                    status: chance ? "MAYBE" : "WRONG"
                };
            } else {
                const points = calculatePoints(predictedScores, match.score);

                result = {
                    points,
                    status: points ? "RIGHT" : "WRONG"
                };
            }

            const totalPoints =
                isAllFinished ?
                    p.predictions.reduce((accum, v) => {
                        return accum + (v.results?.points || 0);
                    }, 0) + (result?.points || 0) : 0;

            predictionUpdates.push({
                updateOne: {
                    filter: {
                        _id: p._id,
                        "predictions.matchId": match.matchId
                    },
                    update: {
                        $set: {
                            "predictions.$.results": result,
                            totalPoints
                        },
                    },
                },
            });
        }

        if (predictionUpdates.length) {
            await UserPrediction.bulkWrite(predictionUpdates, { session });
        }

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}

export const newMatches = async () => {

    const matches = await Match
        .find({ status: { $in: ["SCHEDULED", "TIMED"] } })
        .select("-__v  -score")
        .sort({ utcDate: 1 })
        .lean();

    return matches;

}

export const matches = async (limit: number) => {

    const matches = await Match.aggregate([
        {
            $match: {
                status: { $in: ["IN_PLAY", "PAUSED", "FINISHED"] },
                isUsed: false
            }
        },
        {
            $addFields: {
                statusPriority: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $in: ["$status", ["LIVE", "IN_PLAY", "PAUSED"]]
                                },
                                then: 1
                            },
                            { case: { $eq: ["$status", "FINISHED"] }, then: 2 }
                        ],
                        default: 99,
                    },
                },
            },
        },
        {
            $sort: {
                statusPriority: 1,
                utcDate: -1,
            },
        },
        {
            $project: {
                __v: 0,
                statusPriority: 0,
            },
        },
        {
            $limit: limit,
        },
    ]);

    return matches;
}