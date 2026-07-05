import mongoose from "mongoose";
import { User } from "../models/user.model"
import AppError from "../utils/AppError";
import { UserPrediction } from "../models/userPrediction.model";
import { Prediction } from "../models/prediction.model";
import { Match } from "../models/match.model";

export const leaderboard = async () => {

    const users = await User
        .find({ isVerified: true, role: "predictor" })
        .sort({ totalPoints: -1 })
        .select("name totalPoints avatar number");

    return users;

}

export const updateLeaderboard = async (predictionId: string) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const prediction = await Prediction.findById(predictionId).session(session);;
        if (!prediction) throw new AppError(404, "Prediction not found!");
        if (prediction.isEvaluated) throw new AppError(400, "Prediction is already evaluated!");
        if (prediction.status === "LIVE") throw new AppError(403, "Cannot update now prediction is live!");

        const matches = await Match
            .find({
                _id: {
                    $in: prediction.matches.map(v => v.matchId)
                },
                status: "FINISHED"
            })
            .session(session);

        if (matches.length !== prediction.matches.length) {
            throw new AppError(400, "Some matches are not finished yet!");
        }

        const userPredictions = await UserPrediction
            .find({
                predictionId,
                isEvaluated: false
            })
            .populate("predictorId", "name avatar")
            .sort({ totalPoints: -1 })
            .select("_id predictorId totalPoints")
            .session(session);

        if (!userPredictions.length) {
            throw new AppError(400, "All users predictions are already evaluated!");
        }

        const scoreUpdations = [];
        const predictionUpdations = [];

        for (const p of userPredictions) {

            scoreUpdations.push({
                updateOne: {
                    filter: { _id: p.predictorId._id },
                    update: {
                        $inc: {
                            totalPoints: p.totalPoints
                        }
                    }
                }
            })

            predictionUpdations.push({
                updateOne: {
                    filter: { _id: p._id },
                    update: {
                        $set: {
                            isEvaluated: true
                        }
                    }
                }
            })
        }

        await Promise.all([
            User.bulkWrite(scoreUpdations, { session }),
            UserPrediction.bulkWrite(predictionUpdations, { session }),
            prediction.updateOne({ $set: { isEvaluated: true } }, { session })
        ]);

        await session.commitTransaction();
        return userPredictions;

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }


}