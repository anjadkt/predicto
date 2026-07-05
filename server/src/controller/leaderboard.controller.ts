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

export const updateLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const predictionId = req.params.id as string;

        const leaderboard = await leaderboardService.updateLeaderboard(predictionId);

        res.status(200).json(
            new ApiResponse("Leaderboard updated successfully!", leaderboard)
        );

    } catch (error) {
        next(error);
    }
}