import { User } from "../models/user.model"
import AppError from "../utils/AppError";


export const getAll = async () => {

    const users = await User.aggregate([
        {
            $project: {
                password: 0,
                refreshToken: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            }
        },
        {
            $sort: {
                createdAt: -1,
            }
        },

        {
            $facet: {
                verified: [
                    { $match: { isVerified: true, role: "predictor" } }
                ],
                unverified: [
                    { $match: { isVerified: false, role: "predictor" } }
                ]
            }
        }

    ])
    return users[0];
}

export const updateUserDetails = async (
    userId: string,
    payload : {
        score : number;
        isVerified : boolean
    }
) => {

    const user = await User
        .findByIdAndUpdate(
            userId,
            {
                $set: {
                    totalPoints: payload.score,
                    isVerified : payload.isVerified
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