import { Router } from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import preductionRoutes from "./routes/prediction.routes";
import matchRoutes from "./routes/match.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/predictions", preductionRoutes);
router.use("/matchs", matchRoutes);

export default router;