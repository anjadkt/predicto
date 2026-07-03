import { User } from "../models/user.model";
import { JWTPayload, LoginPayload, RegisterPayload } from "../types/auth.types";
import AppError from "../utils/AppError";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from "../config/env";
import { createToken } from "../utils/createToken";

export const register = async (payload: RegisterPayload) => {

    const { name, number, password, avatar } = payload;

    if (!name || !password || !number) throw new AppError(400, "All fields are required");

    if (password.length < 6 || number.length < 10) throw new AppError(400, "Invalid password or number");

    const userExists = await User.findOne({ number }).lean();
    if (userExists) throw new AppError(409, "User already exists");

    const hashedPass = await bcrypt.hash(password, Number(env.SALT))

    const user = await User.create({
        name,
        number,
        password: hashedPass,
        avatar
    })

    return {
        name: user.name,
        number: user.number,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar
    };


}

export const login = async (payload: LoginPayload) => {

    const { number, password } = payload

    if (!number || !password) throw new AppError(400, "All fields are required")

    if (password.length < 6 || number.length < 10) throw new AppError(400, "Invalid password or number")

    const user = await User.findOne({ number })
    if (!user) throw new AppError(404, "User not found");
    if (!user.isVerified) throw new AppError(401, "User not verified by admin");

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) throw new AppError(401, "Invalid password");

    const accessToken = createToken({
        _id: user._id,
        number: user.number,
        role: user.role
    }, env.JWT_ACCESS_SECRET, env.ACCESS_TOKEN_EXPIRES_IN);

    const refreshToken = createToken({
        _id: user._id
    }, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_EXPIRES_IN);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            _id: user._id,
            name: user.name,
            number: user.number,
            role: user.role,
            isVerified: user.isVerified,
            avatar: user.avatar
        },
        accessToken,
        refreshToken
    }


}

export const refresh = async (refreshToken: string) => {

    if (!refreshToken) throw new AppError(403, "Refresh token required");

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JWTPayload;
    if (!decoded) throw new AppError(403, "Invalid refresh token");

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) throw new AppError(403, "Invalid refresh token");

    const accessToken = createToken({
        _id: user._id,
        number: user.number,
        role: user.role
    }, env.JWT_ACCESS_SECRET, env.ACCESS_TOKEN_EXPIRES_IN);

    const newRefreshToken = createToken({
        _id: user._id
    }, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_EXPIRES_IN);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken: newRefreshToken
    }

}

export const logout = async function (userId: string) {

    const user = await User.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    user.refreshToken = "";
    await user.save();

    return;
}

export const getMe = async (userId: string) => {

    const user = await User.findById(userId).select("-password -__v -updatedAt -refreshToken");
    if (!user) throw new AppError(404, "User not found");

    return user;
}
