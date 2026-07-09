import type { PredictedPayload, PredictionPayload } from "../types/prediction.types";
import { Match } from "../models/match.model";
import AppError from "../utils/AppError";
import { Prediction } from "../models/prediction.model";
import { User } from "../models/user.model";
import { UserPrediction } from "../models/userPrediction.model";
import mongoose from "mongoose";

export const create = async (payload: PredictionPayload) => {


    const matches = await Match.aggregate([
        {
            $match: {
                _id: {
                    $in: payload.matches.map(match => new mongoose.Types.ObjectId(match.matchId))
                },
                isUsed: false
            }
        },
        {
            $project: {
                _id: 0,
                matchId: "$_id",
                apiMatchId: 1,
                awayTeam: 1,
                homeTeam: 1,
                date: 1,
                time: 1,
                utcDate: 1
            }
        },
        {
            $sort: {
                utcDate: 1
            }
        }
    ]);

    if (matches.length !== payload.matches.length) {
        throw new AppError(400, "Some matches are already used for prediction")
    }

    const now = new Date();
    const closesAtDate = payload.closesAt ? new Date(payload.closesAt) : null;
    const firstMatchDate = new Date(matches[0].utcDate);

    if (closesAtDate) {

        if (closesAtDate <= now) {
            throw new AppError(
                400,
                "Prediction close time must be in the future."
            );
        }

        if (closesAtDate >= firstMatchDate) {
            throw new AppError(
                400,
                "Prediction close time must be before the first match starts."
            );
        }
    }

    const prediction = await Prediction.create({
        matches,
        closesAt: closesAtDate || firstMatchDate
    })

    await Match.updateMany({
        _id: {
            $in: payload.matches.map((match) => match.matchId)
        }
    }, {
        $set: {
            isUsed: true,
            predictionId: prediction._id
        }
    })

    return {
        matches: prediction.matches,
        closesAt: prediction.closesAt,
        _id: prediction._id,
        status: prediction.status,
        createdAt: prediction.createdAt
    }

}

export const getAll = async (limit = 10, predictorId: string, role: string) => {

    const predictions = await Prediction.aggregate([
        {
            $addFields: {
            statusOrder: {
                $switch: {
                branches: [
                    { case: { $eq: ["$status", "LIVE"] }, then: 0 },
                    { case: { $eq: ["$status", "COMPLETED"] }, then: 1 },
                ],
                default: 2,
                },
            },
            },
        },
        {
            $sort: {
            statusOrder: 1,
            closesAt: -1,
            },
        },
        {
            $limit: limit,
        },
        {
            $project: {
            __v: 0,
            isEvaluated: 0,
            updatedAt: 0,
            statusOrder: 0,
            },
        }
    ]);

    let userPredictions: any = [];

    if (role !== "creator") {
        userPredictions = await UserPrediction
            .find({ predictorId })
            .populate([
                { 
                    path: "predictions.matchId",
                    select : "awayTeam homeTeam score time status"
                },
                {
                    path : "predictionId",
                    select : "closesAt"
                }
            ])
            .select("-__v -updatedAt")
            .sort({createdAt : -1})
            .limit(limit)
            .lean();
    }

    return {
        predictions,
        userPredictions
    };

}

export const predict = async (predictorId: string, predictionId: string, predictions: PredictedPayload) => {

    const isPredictionExist = await Prediction.findById(predictionId).lean();
    if (!isPredictionExist) throw new AppError(404, "Prediction not found!");

    const isPredicted = await UserPrediction.findOne({
        predictionId,
        predictorId
    }).lean();
    if (isPredicted) throw new AppError(409, "User already predicted this prediction!");

    if (new Date() >= isPredictionExist.closesAt) {
        throw new AppError(400, "Prediction has been closed.");
    }

    const isValid = predictions.every((prediction) => {
        const scores = prediction.predictedScores;
        return (
            scores.homeTeam >= 0 && scores.homeTeam <= 10 &&
            scores.awayTeam >= 0 && scores.awayTeam <= 10
        )
    });
    if (!isValid) throw new AppError(400, "Invalid prediction data!");

    const user = await User.findById(predictorId).select("isVerified").lean();
    if (!user?.isVerified) throw new AppError(404, "User not found!");

    const matches = await Match
        .find({
            _id: { $in: predictions.map(v => v.matchId) },
            status: {
                $in: ["SCHEDULED", "TIMED"]
            }
        })
    if (matches.length !== predictions.length) throw new AppError(400, "Some matches are not found!");

    const userPrediction = await UserPrediction.create({
        predictorId,
        predictionId,
        predictions: predictions.map(
            (v) => ({
                matchId: v.matchId,
                predictedScores: v.predictedScores
            })
        ),
        isEvaluated: false
    });

    return {
        _id: userPrediction._id,
        predictions: userPrediction.predictions,
        predictionId: userPrediction.predictionId,
        predictorId: userPrediction.predictorId
    };
}

export const update = async (predictorId: string, predictionId: string, predictions: PredictedPayload) => {

    const isPredictionExist = await Prediction.findById(predictionId).lean();
    if (!isPredictionExist) throw new AppError(404, "Prediction not found!");

    if (new Date() > isPredictionExist.closesAt) {
        throw new AppError(400, "Prediction has been closed.");
    }

    const user = await User.findById(predictorId).select("isVerified").lean();
    if (!user?.isVerified) throw new AppError(404, "User not found!");

    const isValid = predictions.every((prediction) => {
        const scores = prediction.predictedScores;
        return (
            scores.homeTeam >= 0 && scores.homeTeam <= 10 &&
            scores.awayTeam >= 0 && scores.awayTeam <= 10
        )
    });
    if (!isValid) throw new AppError(400, "Invalid prediction data!");

    const matches = await Match
        .find({
            _id: { $in: predictions.map(v => v.matchId) },
            status: {
                $in: ["SCHEDULED", "TIMED"]
            }
        })
    if (matches.length !== predictions.length) throw new AppError(404, "Some matches are not found!");

    const userPrediction = await UserPrediction.findOneAndUpdate(
        {
            predictionId,
            predictorId,
        },
        {
            $set: {
                predictions: predictions.map(
                    (v) => ({
                        matchId: v.matchId,
                        predictedScores: v.predictedScores
                    })
                )
            }
        },
        {
            new: true
        }
    ).select("-_v -createdAt -updatedAt");
    if (!userPrediction) throw new AppError(404, "Failed to update prediction!");

    return userPrediction;

}

export const matchPredictions = async (matchId: string) => {

    const match = await Match.findById(matchId).select("-__v -createdAt -updatedAt").lean();
    if (!match) throw new AppError(404, "Match not found!");

    const userPredictions = await UserPrediction.aggregate([
        {
            $match: {
                predictionId: match.predictionId
            }
        },
        {
            $unwind: "$predictions"
        },
        {
            $match: {
                "predictions.matchId": match._id
            }
        },
        {
            $lookup: {
                from: "users",
                let: { userId: "$predictorId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$userId"]
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            avatar: 1
                        }
                    }
                ],
                as: "predictor"
            }
        },
        {
            $unwind: "$predictor"
        },
        {
            $group: {
                _id: "$predictions.results.status",
                count: { $sum: 1 },
                predictions: {
                    $push: {
                        predictor: "$predictor",
                        points: {
                            $ifNull: ["$predictions.results.points", 0]
                        },
                        prediction: "$predictions.predictedScores"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                count: 1,
                predictions: 1
            }
        }
    ]);

    const statuses = match.status === "FINISHED" ? ["RIGHT", "WRONG"] : ["MAYBE", "RIGHT", "WRONG"] ;

    const result = statuses.map((status) => {

        return (
            userPredictions.find((item) => item.status === status) ?? {
                status,
                count: 0,
                predictions: [],
            }
        );
    });

    return result;
}

export const results = async (predictionId: string) => {

    const prediction = await Prediction.findById(predictionId).lean();
    if (!prediction) throw new AppError(404, "Prediction not found!");

    const userPredictions = await UserPrediction.aggregate([
        {
            $match: {
                predictionId: new mongoose.Types.ObjectId(predictionId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "predictorId",
                foreignField: "_id",
                as: "predictor"
            }
        },
        {
            $unwind: "$predictor"
        },
        {
            $group: {
                _id: "$totalPoints",
                count: { $sum: 1 },
                predictors: {
                    $push: {
                        _id: "$predictor._id",
                        name: "$predictor.name",
                        avatar: "$predictor.avatar",
                        number: "$predictor.number",
                        predictions: "$predictions"
                    }
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        },
        {
            $project: {
                _id: 0,
                points: "$_id",
                count: 1,
                predictors: 1
            }
        }
    ]);

    return userPredictions;
}

export const userPrediction = async (predictorId: string, predictionId: string) => {

    const userPrediction = await UserPrediction
        .findOne({
            predictorId,
            predictionId
        })
        .populate({
            path: "predictions.matchId",
            select: "awayTeam.name awayTeam.shortName awayTeam.tla awayTeam.crest homeTeam.name homeTeam.shortName homeTeam.tla homeTeam.crest time"
        })
        .select("totalPoints predictions")
        .lean();

    if (!userPrediction) throw new AppError(404, "User prediction not found!");

    return userPrediction;
}