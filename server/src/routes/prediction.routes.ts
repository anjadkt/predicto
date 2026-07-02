import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createPrediction, getAllPrediction, getPredictionResults, updatePrediction, userPrediction, getMatchPredictions } from "../controller/prediction.controller";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/", authenticateUser, getAllPrediction);
router.post("/", authenticateUser, authorize("creator"), createPrediction);
router.post("/:id/predict", authenticateUser, userPrediction);
router.patch("/:id/predict", authenticateUser, updatePrediction);
router.get("/:matchId", authenticateUser, getMatchPredictions);

// not completed
router.get("/:id/results", authenticateUser, authorize("creator"), getPredictionResults);

export default router;