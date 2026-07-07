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