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
        setTimeout(syncMatches, 1 * 60 * 1000);
    }
}

export const newMatchsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const matches = await matchService.getMatches(req.query as MatchQuery);

        // res.status(200).json(
        //     new ApiResponse("Matches fetched successfully", matches)
        // );

    } catch (error) {
        next(error);
    }
}

export const createMatchController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { matchId } = req.params;

        // const matches = await matchService.getMatches(req.query as MatchQuery);

        // const match = await matchService.createMatch(matches, matchId as string);

        // res.status(200).json(
        //     new ApiResponse("Match created successfully", match)
        // );
    } catch (error) {
        next(error);
    }
}