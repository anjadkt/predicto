import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createPrediction, getAllPrediction, getPredictionResults, userPrediction } from "../controller/prediction.controller";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticateUser, authorize("creator"), createPrediction);
router.get("/", authenticateUser, getAllPrediction);
router.post("/:id/predict", authenticateUser, userPrediction);

router.get("/:id/results", authenticateUser, authorize("creator"), getPredictionResults);


export default router;