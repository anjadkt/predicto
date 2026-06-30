import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import type { AllowedRoles } from "../types/users.types";
import { User } from "../models/user.model";

export const authorize =
    (allowedRole: AllowedRoles) =>
        async (req: Request, res: Response, next: NextFunction) => {

            const user = await User.findById(req.user?._id);

            if (!user) return next(new AppError(404, "User not found"));

            if (allowedRole !== user.role) return next(new AppError(403, "Forbidden: Insufficient permissions"));

            next();
        };