import { Router } from "express";
import { getMeController, loginController, logoutController, refreshController, registerController } from "../controller/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware";
import authLimiter from "../middlewares/limit.middleware"

const router = Router();

router.get("/me", authenticateUser, getMeController);
router.get("/refresh", refreshController);
router.get("/logout", authenticateUser, logoutController);
router.post("/register", authLimiter(5,5), registerController);
router.post("/login", authLimiter(5,5), loginController);



export default router;