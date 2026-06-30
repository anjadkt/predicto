import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { getLivePrediction, createPrediction } from "../controller/prediction.controller";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticateUser, authorize("creator"), createPrediction)

router.get("/live", authenticateUser, getLivePrediction);


export default router;