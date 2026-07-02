import { Router } from "express";
import { getLeaderboard, updateScore } from "../controller/leaderboard.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticateUser);

router.get("/", getLeaderboard);
router.patch("/:id", authorize("creator"), updateScore);

export default router;