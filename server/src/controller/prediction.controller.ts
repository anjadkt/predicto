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
        const predictions = await predictionService.getAll(Number(req.query.limit as string));
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
            new ApiResponse("Prediction updated successfully", userPrediction)
        );
    } catch (error) {
        next(error);
    }
}

export const getPredictionResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const prediction = await predictionService.results(req.params.id as string);

        // res.status(200).json(
        //     new ApiResponse("Prediction fetched successfully!", prediction)
        // )
    } catch (error) {
        next(error);
    }
}