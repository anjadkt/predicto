import type { CookieOptions, NextFunction, Request, Response } from "express"
import ApiResponse from "../utils/ApiResponse.js";
import * as authServices from "../services/auth.service.js";
import { env } from "../config/env.js";

const accessOptions:CookieOptions = env.NODE_ENV === "production" ? {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
    sameSite: "none",
    partitioned : true
} : {
    httpOnly: true,
    secure: false,
    maxAge: 15 * 60 * 1000,
    sameSite: "lax"
    
}

const refreshOptions:CookieOptions = env.NODE_ENV === "production" ? {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    partitioned : true
} : {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax"
    
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { user, accessToken, refreshToken } = await authServices.register(req.body,req.ip || "");

        res.cookie("access_token", accessToken, accessOptions);

        res.cookie("refresh_token", refreshToken, refreshOptions);

        res.status(201).json(new ApiResponse("User registered successfully", user));

    } catch (error: any) {
        next(error);
    }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { user, accessToken, refreshToken } = await authServices.login(req.body);

        res.cookie("access_token", accessToken, accessOptions);

        res.cookie("refresh_token", refreshToken, refreshOptions);

        res.status(200).json(new ApiResponse("User logged in successfully", user));

    } catch (error: any) {
        next(error);
    }
}

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const refresh_token = req.cookies.refresh_token;
        const { accessToken, refreshToken } = await authServices.refresh(refresh_token);

        res.cookie("access_token", accessToken, accessOptions);

        res.cookie("refresh_token", refreshToken, refreshOptions);

        res.status(200).json(new ApiResponse("Tokens refreshed successfully"));

    } catch (error: any) {
        next(error);
    }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        await authServices.logout(req.user?._id as string);

        res.clearCookie("access_token", accessOptions);
        res.clearCookie("refresh_token", refreshOptions);

        res.status(200).json(new ApiResponse("User logged out successfully"));

    } catch (error: any) {
        next(error);
    }
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authServices.getMe(req.user?._id as string);
        res.status(200).json(new ApiResponse("User fetched successfully", user));

    } catch (error: any) {
        next(error);
    }
}