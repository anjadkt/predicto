import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/users.service";
import ApiResponse from "../utils/ApiResponse";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await userService.getAll();

        res.status(200).json(new ApiResponse("Users fetched successfully", users));

    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await userService.updateUserDetails(
            req.params.userId as string,
            req.body
        );

        res.status(200).json(new ApiResponse(`User ${user.isVerified ? "verified" : "unverified"} successfully`, user));

    } catch (error) {
        next(error);
    }
}