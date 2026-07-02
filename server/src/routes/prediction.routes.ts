import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createPrediction, getAllPrediction, getPredictionResults, updatePrediction, userPrediction, getMatchPredictions } from "../controller/prediction.controller";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticateUser)

router.get("/", getAllPrediction);
router.post("/", authorize("creator"), createPrediction);
router.post("/:id/predict", userPrediction);
router.patch("/:id/predict", updatePrediction);
router.get("/:matchId", getMatchPredictions);

// not completed
router.get("/:id/results", authorize("creator"), getPredictionResults);

export default router;