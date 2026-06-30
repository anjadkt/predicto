import { Router } from "express";
import { getMeController, loginController, logoutController, refreshController, registerController } from "../controller/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshController);
router.get("/logout", authenticateUser, logoutController);
router.get("/me", authenticateUser, getMeController);

export default router;