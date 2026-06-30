import { User } from "../models/user.model"


export const getAll = async () => {

    const users = await User.aggregate([
        {
            $project: {
                password: 0,
                refreshToken: 0,
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
                    { $match: { isVerified: true } }
                ],
                unverified: [
                    { $match: { isVerified: false } }
                ]
            }
        }

    ])
    return users[0];
}

export const verifyUser = async (userId: string) => {

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new Error("User not found");
    }

    user.isVerified = !user.isVerified;
    await user.save();

    return user;
}