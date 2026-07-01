import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createPrediction, getAllPrediction, getPredictionResults, updatePrediction, userPrediction, getMatchPredictions } from "../controller/prediction.controller";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/", authenticateUser, getAllPrediction);
router.post("/:id/predict", authenticateUser, userPrediction);
router.post("/", authenticateUser, authorize("creator"), createPrediction);
router.patch("/:id/predict", authenticateUser, updatePrediction);

// not completed
router.get("/:id/results", authenticateUser, authorize("creator"), getPredictionResults);
router.get("/:matchId", authenticateUser, getMatchPredictions);

export default router;