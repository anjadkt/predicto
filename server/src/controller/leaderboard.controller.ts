import type { NextFunction, Request, Response } from "express";
import * as leaderboardService from "../services/leaderboard.service";
import ApiResponse from "../utils/ApiResponse";


export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaderboard = await leaderboardService.leaderboard();

        res.status(200).json(
            new ApiResponse("Leaderboard fetched successfully!", leaderboard)
        );
    } catch (error) {
        next(error)
    }
}