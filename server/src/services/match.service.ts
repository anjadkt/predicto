import { Match } from "../models/match.model";
import { formatDate, formatTime, utcToIst } from "../utils/formatDate";
import { getMatchesFromApi } from "../utils/getMatchesApi";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import { UserPrediction } from "../models/userPrediction.model";
import { calculatePoints } from "../utils/calcPoints";
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

        session.startTransaction();

        const isMatchExist = await Match.findById(match.matchId);
        if (!isMatchExist) {
            throw new AppError(404, "Match not found");
        }

        if (type === "FINISHED") {

            const prediction = await Prediction
                .findById(isMatchExist.predictionId)
                .populate("matches.matchId", "_id status")
                .select("matches")
                .session(session);
            if (!prediction) {
                throw new AppError(404, "Prediction not found!");
            }

            const isAllFinished = prediction.matches.every(
                (v: any) => v.matchId._id.toString() === match.matchId.toString() ? true : v.matchId.status === "FINISHED"
            );

            if (isAllFinished) {
                prediction.status = "COMPLETED";
                await prediction.save({ session });
            }

        }

        const userPredictions = await UserPrediction.find({
            predictionId: isMatchExist.predictionId
        });

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

            const totalPoints = p.predictions.reduce((accum, v) => {
                if (v.matchId.toString() === match.matchId.toString()) {
                    return accum + (result?.points || 0);
                }
                return accum + (v.results?.points || 0);
            }, 0);

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

        console.log(type === "FINISHED" ? "Finished matches and predictions are updated" : "Live matches and predictions are updated")

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
        .find({ status: { $in: ["SCHEDULED", "TIMED"] }, isUsed: false })
        .select("-__v  -score -createdAt -isUsed -updatedAt -istDate")
        .sort({ utcDate: 1 })
        .lean();

    return matches;

}

export const matches = async (limit: number) => {

    const matches = await Match.aggregate([
        {
            $match: {
                status: { $in: ["IN_PLAY", "PAUSED", "LIVE", "FINISHED"] },
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
                isUsed: 0,
                createdAt: 0,
                updatedAt: 0,
                istDate: 0,
            },
        },
        {
            $limit: limit,
        },
    ]);

    return matches;
}