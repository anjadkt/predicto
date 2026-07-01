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

    console.log(matches);

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
            isUsed: true
        }
    })

    return prediction

}

export const getAll = async (limit: number = 10) => {

    const predictions = await Prediction.aggregate([
        {
            $sort: {
                closesAt: -1
            }
        },
        {
            $limit: limit
        },
        {
            $group: {
                _id: "$status",
                predictions: {
                    $push: "$$ROOT",
                }
            }
        },
        {
            $project: {
                _id: 0,
                status: "$_id",
                predictions: 1
            }
        }
    ]);

    return predictions;

}

export const predict = async (predictorId: string, predictionId: string, predictions: PredictedPayload) => {

    const isValid = predictions.every((prediction) => {
        const scores = prediction.predictedScores;
        return (
            scores.homeTeam >= 0 &&
            scores.awayTeam >= 0
        )
    });
    if (!isValid) throw new AppError(400, "Invalid prediction data!");

    const user = await User.findById(predictorId).select("isVerified").lean();
    if (!user || !user?.isVerified) throw new AppError(404, "User not found!");

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
        .sort({ utcDate: 1 })
        .lean();
    if (matches.length !== predictions.length) throw new AppError(400, "Some matches are not found!");

    const userPrediction = await UserPrediction.create({
        predictorId,
        predictionId,
        predictions
    });

    return userPrediction;
}

export const results = async (predictionId: string) => {

    const prediction = await Prediction
        .findById(predictionId)
        .select("-_v ")
        .lean();



}