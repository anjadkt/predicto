import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { getMatchesController, newMatchsController } from "../controller/match.controller";

const router = Router();

router.use(authenticateUser);

router.get("/new", authorize("creator"), newMatchsController);
router.get("/", getMatchesController);

export default router;