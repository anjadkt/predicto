import { User } from "../models/user.model"
import AppError from "../utils/AppError";

export const leaderboard = async () => {

    const users = await User
        .find({ isVerified: true, role: "predictor" })
        .sort({ totalPoints: -1 })
        .select("name totalPoints avatar number");

    return users;

}

export const update = async (userId: string, score: number) => {

    const user = await User
        .findByIdAndUpdate(
            userId,
            {
                $set: {
                    totalPoints: score
                }
            },
            {
                new: true
            }
        )
        .select("name totalPoints avatar number");
    if (!user) throw new AppError(404, "User not found!");

    return user;

}