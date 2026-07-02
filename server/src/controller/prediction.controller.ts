import { NextFunction, Request, Response } from "express";
import * as predictionService from "../services/prediction.service"
import ApiResponse from "../utils/ApiResponse";
import { PredictedPayload } from "../types/prediction.types";

export const createPrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prediction = await predictionService.create(req.body);
        res.status(201).json(
            new ApiResponse("Prediction created successfully!", prediction)
        );
    } catch (error) {
        next(error);
    }
}

export const getAllPrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const predictions = await predictionService.getAll(
            Number(req.query?.limit as string || 10),
            req.user?._id || "",
            req.user?.role as string
        );
        res.status(200).json(
            new ApiResponse("Prediction fetched successfully!", predictions)
        )
    } catch (error) {
        next(error)
    }
}

export const userPrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id || ""
        const predictionId = req.params.id as string;
        const predictions = req.body.predictions as PredictedPayload

        const userPrediction = await predictionService.predict(
            userId,
            predictionId,
            predictions
        )

        res.status(201).json(
            new ApiResponse("Prediction made successfully!", userPrediction)
        );
    } catch (error) {
        next(error);
    }
}

export const updatePrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id || ""
        const predictionId = req.params.id as string;
        const predictions = req.body.predictions as PredictedPayload

        const userPrediction = await predictionService.update(
            userId,
            predictionId,
            predictions
        );

        res.status(200).json(
            new ApiResponse("User's Prediction updated!", userPrediction)
        );
    } catch (error) {
        next(error)
    }
}

export const getMatchPredictions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const matchId = req.params.matchId as string;

        const predictions = await predictionService.matchPredictions(matchId);

        res.status(200).json(
            new ApiResponse("Match predictions fetched successfully!", predictions)
        );
    } catch (error) {
        next(error);
    }
}

export const getPredictionResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const predictions = await predictionService.results(req.params.id as string);

        res.status(200).json(
            new ApiResponse("Prediction fetched successfully!", predictions)
        )
    } catch (error) {
        next(error);
    }
}

export const getUserPrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId as string;
        const predictionId = req.params.id as string;

        const prediction = await predictionService.userPrediction(userId, predictionId);

        res.status(200).json(
            new ApiResponse("User prediction fetched successfully", prediction)
        )
    } catch (error) {
        next(error);
    }
}