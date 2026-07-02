import type { PredictedPayload, PredictionPayload } from "../types/prediction.types";
import { Match } from "../models/match.model";
import AppError from "../utils/AppError";
import { Prediction } from "../models/prediction.model";
import { User } from "../models/user.model";
import { UserPrediction } from "../models/userPrediction.model";
import mongoose from "mongoose";

export const create = async (payload: PredictionPayload) => {

    const matches = await Match
        .find({
            _id: {
                $in: payload.matches.map((match) => match.matchId)
            },
            isUsed: false
        })
        .select("-__v -createdAt -updatedAt -isUsed -score -istDate -status")
        .sort({ utcDate: 1 })

    if (matches.length !== payload.matches.length) {
        throw new AppError(400, "Some matches are already used for prediction")
    }

    const matchDate = new Date(matches[0].utcDate);
    const closesAt = new Date(payload.closesAt);

    const date = matchDate < closesAt ? closesAt : matchDate;

    const prediction = await Prediction.create({
        matches,
        closesAt: date
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
            $facet: {
                live: [
                    {
                        $match: {
                            status: "LIVE",
                        },
                    },
                    {
                        $sort: {
                            closesAt: -1,
                        },
                    },
                    {
                        $project: {
                            __v: 0,
                            isEvaluated: 0,
                            updatedAt: 0
                        }
                    }
                ],

                completed: [
                    {
                        $match: {
                            status: "COMPLETED",
                        },
                    },
                    {
                        $sort: {
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
                            updatedAt: 0
                        }
                    }
                ],
            },
        },
    ]);

    let userPredictions: any = [];

    if (role !== "creator") {
        userPredictions = await UserPrediction
            .find({ predictorId })
            .populate("predictions.matchId", "awayTeam homeTeam score")
            .select("-_v -updatedAt")
            .limit(limit)
            .lean();
    }

    return {
        predictions: predictions[0] || { live: [], completed: [] },
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

    if (new Date() > isPredictionExist.closesAt) {
        throw new AppError(400, "Prediction has been closed.");
    }

    const isValid = predictions.every((prediction) => {
        const scores = prediction.predictedScores;
        return (
            scores.homeTeam >= 0 &&
            scores.awayTeam >= 0
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
        predictions
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
            scores.homeTeam >= 0 &&
            scores.awayTeam >= 0
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
                predictions
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
            $group: {
                _id: "$predictions.results.status",
                count: { $sum: 1 },
                predictions: {
                    $push: {
                        predictorId: "$predictorId",
                        totalPoints: "$totalPoints",
                        prediction: "$predictions"
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
    ])
    return userPredictions;
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
        .populate("predictions.matchId", "awayTeam homeTeam time")
        .select("totalPoints predictions")
        .lean();

    if (!userPrediction) throw new AppError(404, "User prediction not found!");

    return userPrediction;
}