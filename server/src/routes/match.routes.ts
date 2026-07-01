import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { getMatchesController, newMatchsController } from "../controller/match.controller";

const router = Router();

router.get("/new", authenticateUser, authorize("creator"), newMatchsController);
router.get("/", authenticateUser, getMatchesController);

export default router;