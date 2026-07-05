import { Router } from "express";
import { getLeaderboard, updateLeaderboard } from "../controller/leaderboard.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticateUser);

router.get("/", getLeaderboard);
router.post("/:id", authorize("creator"), updateLeaderboard)

export default router;