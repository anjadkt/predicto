import type { PredictedPayload, PredictionPayload } from "../types/prediction.types";
import { Match } from "../models/match.model";
import AppError from "../utils/AppError";
import { Prediction } from "../models/prediction.model";
import { User } from "../models/user.model";
import { UserPrediction } from "../models/userPrediction.model";

export const create = async (payload: PredictionPayload) => {

    const matches = await Match
        .find({
            _id: {
                $in: payload.matches.map((match) => match._id)
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
            $in: payload.matches.map((match) => match._id)
        }
    }, {
        $set: {
            isUsed: true,
            predictionId: prediction._id
        }
    })

    return prediction

}

export const getAll = async (limit: number = 10, predictorId: string, creator: string) => {

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
                ],
            },
        },
    ]);

    let userPredictions: any = [];

    if (creator === "false") {
        userPredictions = await UserPrediction
            .find({ predictorId })
            .populate("predictions.matchId", "awayTeam homeTeam score")
            .select("-_v -updatedAt")
            .limit(limit)
            .lean();
    }

    return { predictions, userPredictions };

}

export const predict = async (predictorId: string, predictionId: string, predictions: PredictedPayload) => {

    const isPredictionExist = await Prediction.findById(predictionId).lean();
    if (!isPredictionExist) throw new AppError(404, "Prediction not found!");

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

    const isPredicted = await UserPrediction.findOne({
        predictionId,
        predictorId
    }).lean();
    if (isPredicted) throw new AppError(409, "User already predicted this prediction!");

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

    return userPrediction;
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
    if (matches.length !== predictions.length) throw new AppError(400, "Some matches are not found!");

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


//not completed

export const results = async (predictionId: string) => {

    const prediction = await Prediction.findById(predictionId).lean();
    if (!prediction) throw new AppError(404, "Prediction not found!");

    const matches = await Match
        .find({
            _id: {
                $in: prediction.matches.map(v => v.matchId)
            },
            status: "FINISHED"
        });

    if (matches.length !== prediction.matches.length) {
        throw new AppError(400, "Some matches are not finished yet!");
    }







}