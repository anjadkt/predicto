import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import jwt from 'jsonwebtoken'
import { JWTPayload } from "../types/auth.types";


export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            throw new AppError(401, "No access token provided");
        }

        const decodedToken = jwt.verify(accessToken, env.JWT_ACCESS_SECRET);
        if (!decodedToken) throw new AppError(401, "Invalid access token");
        req.user = decodedToken as JWTPayload;

        next();
    } catch (error: any) {

        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError(401, "Access token expired"));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError(401, "Invalid access token"));
        }

        next(error);
    }
}