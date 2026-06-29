import type { NextFunction, Request, Response } from "express"
import ApiResponse from "../utils/ApiResponse.js";
import * as authServices from "../services/auth.service.js";
import { env } from "../config/env.js";

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await authServices.registerService(req.body);

        res.status(201).json(new ApiResponse("User registered successfully", user));

    } catch (error: any) {
        next(error);
    }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { user, accessToken, refreshToken } = await authServices.loginService(req.body);

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            maxAge: ACCESS_TOKEN_MAX_AGE,
            sameSite: "lax"
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            maxAge: REFRESH_TOKEN_MAX_AGE,
            sameSite: "lax"
        });

        res.status(200).json(new ApiResponse("User logged in successfully", user));

    } catch (error: any) {
        next(error);
    }
}