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

export const updateScore = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.params.id as string;
        const score = Number(req.body.score as string);

        const updatedUser = await leaderboardService.update(userId, score);

        res.status(200).json(
            new ApiResponse("Score updated successfully!", updatedUser)
        )

    } catch (error) {
        next(error);
    }
}