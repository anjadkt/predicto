import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import preductionRoutes from "./routes/prediction.routes";
import matchRoutes from "./routes/match.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/matchs", matchRoutes);
router.use("/predictions", preductionRoutes);

export default router;