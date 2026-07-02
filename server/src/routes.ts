import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import preductionRoutes from "./routes/prediction.routes";
import matchRoutes from "./routes/match.routes";
import leaderboardRoutes from "./routes/learderbaord.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/matches", matchRoutes);
router.use("/predictions", preductionRoutes);
router.use("/leaderboard", leaderboardRoutes);

export default router;