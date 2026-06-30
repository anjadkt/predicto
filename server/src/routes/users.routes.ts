import { Router } from "express";
import { getAllUsers, verifyUser } from "../controller/users.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticateUser, authorize("creator"));

router.get("/", getAllUsers);
router.patch("/:userId", verifyUser);


export default router;