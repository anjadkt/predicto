import { NextFunction, Request, Response } from "express";
import * as matchService from "../services/match.service"
import { MatchQuery } from "../types/matchs.types";
import ApiResponse from "../utils/ApiResponse";


export const syncMatches = async () => {
    try {
        await matchService.sync();
    } catch (error) {
        console.error("Error syncing matches:", error);
    } finally {
        setTimeout(syncMatches, 5 * 30 * 1000);
    }
}

export const newMatchsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const matches = await matchService.newMatches();

        res.status(200).json(
            new ApiResponse("Matches fetched successfully", matches)
        );

    } catch (error) {
        next(error);
    }
}

export const getMatchesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const matches = await matchService.matches(Number(req.query.limit || 10));

        res.status(200).json(
            new ApiResponse("Matches fetched successfully", matches)
        );

    } catch (error) {
        next(error);
    }
}
