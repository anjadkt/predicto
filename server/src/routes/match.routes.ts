import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { createMatchController, newMatchsController } from "../controller/match.controller";

const router = Router();



router.use(authenticateUser, authorize("creator"));

router.get("/new", newMatchsController);
router.post("/", createMatchController)

export default router;