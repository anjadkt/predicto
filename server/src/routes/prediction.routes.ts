import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { createPrediction, getUserPrediction, getAllPrediction, getPredictionResults, updatePrediction, userPrediction, getMatchPredictions } from "../controller/prediction.controller";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticateUser)

router.get("/", getAllPrediction);
router.get("/:id", authorize("creator"), getPredictionResults);
router.get("/:id/user/:userId", authorize("creator"), getUserPrediction);
router.post("/", authorize("creator"), createPrediction);
router.post("/:id/predict", userPrediction);
router.patch("/:id/predict", updatePrediction);
router.get("/match/:matchId", getMatchPredictions);

export default router;