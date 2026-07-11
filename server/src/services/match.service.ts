import { Match } from "../models/match.model";
import { formatDate, formatIsoDate, formatTime, utcToIst } from "../utils/formatDate";
import { getMatchesFromApi, MATCH_DATE_FROM } from "../utils/getMatchesApi";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import { UserPrediction } from "../models/userPrediction.model";
import { calculatePoints } from "../utils/calcPoints";
import { calculateChance } from "../utils/calcChance";
import { Prediction } from "../models/prediction.model";
import { User } from "../models/user.model";

export const sync = async () => {

    const dateFrom = formatIsoDate(new Date(new Date().getTime() - MATCH_DATE_FROM));

    const matchesLive = await Match
        .find({
            status: { $nin: ["POSTPONED", "SUSPENDED", "CANCELLED"] },
            utcDate: { $gte: dateFrom }
        })
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

    const operations = matchesNew.map(match => ({
        updateOne: {
            filter: { apiMatchId: match.id },
            update: {
                $set: {
                    status: match.status,
                    score: match.score
                },
                $setOnInsert: {
                    apiMatchId: match.id,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    utcDate: match.utcDate,
                    istDate: utcToIst(match.utcDate),
                    date: formatDate(match.utcDate),
                    time: formatTime(match.utcDate),
                }
            },
            upsert: true
        }
    }))

    await Match.bulkWrite(operations);

    matchesNew.length > 0 && console.log(`${matchesNew.length} matches synced✅`);
}

export const updateForecast = async (match: any, type: "FINISHED" | "LIVE") => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const isMatchExist = await Match.findById(match.matchId).session(session);
        if (!isMatchExist) {
            throw new AppError(404, "Match not found");
        }

        let isAllFinished = false;

        if (type === "FINISHED") {
            const prediction = await Prediction
                .findById(isMatchExist.predictionId)
                .populate("matches.matchId", "_id status")
                .select("matches")
                .session(session);

            if (!prediction) {
                throw new AppError(404, "Prediction not found!");
            }

            isAllFinished = prediction.matches.every(
                (v: any) => v.matchId._id.toString() === match.matchId.toString() ? true : v.matchId.status === "FINISHED"
            );

            if (isAllFinished) {
                prediction.status = "COMPLETED";
                prediction.isEvaluated = true;
                await prediction.save({ session });
            }
        }

        const userPredictions = await UserPrediction.find({
            predictionId: isMatchExist.predictionId,
            isEvaluated: false
        }).session(session);

        const predictionUpdates = [];

        const scoreUpdations = [];

        for (const p of userPredictions) {

            const prediction = p.predictions.find(v => v.matchId.toString() === match.matchId.toString());

            if (!prediction) continue;

            const { predictedScores, results } = prediction;

            if (!predictedScores || results?.status === "WRONG") continue;

            let result;

            if (type === "LIVE") {

                const chance = calculateChance(predictedScores, match.score);

                if (chance) continue;

                result = {
                    points: 0,
                    status: "WRONG"
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
                            totalPoints,
                            isEvaluated: isAllFinished
                        },
                    },
                },
            });

            if (type === "FINISHED") {

                scoreUpdations.push({
                    updateOne: {
                        filter: { _id: p.predictorId },
                        update: {
                            $inc: {
                                totalPoints: result?.points || 0
                            }
                        }
                    }
                })
            }
        }

        if (predictionUpdates.length) {
            await UserPrediction.bulkWrite(predictionUpdates, { session });
        }

        if (scoreUpdations.length) {
            await User.bulkWrite(scoreUpdations, { session })
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
        .find({ status: { $in: ["SCHEDULED", "TIMED"] }, isUsed: false })
        .select("-__v  -score -createdAt -isUsed -updatedAt -istDate")
        .sort({ utcDate: 1 })
        .lean();

    return matches;

}

export const matches = async (limit = 20) => {

    const matches = await Match.aggregate([
        {
            $match: {
                status: { $nin: ["POSTPONED", "SUSPENDED", "CANCELLED"] },
                isUsed : true
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
                            {
                                case: {
                                    $in: ["$status", ["SCHEDULED", "TIMED"]]
                                },
                                then: 2
                            },
                            { case: { $eq: ["$status", "FINISHED"] }, then: 3 }
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
            $limit: limit,
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
        }
    ]);

    return matches;
}