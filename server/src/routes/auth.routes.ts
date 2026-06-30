import { Router } from "express";
import { loginController, refreshController, registerController } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refreshController);


export default router;