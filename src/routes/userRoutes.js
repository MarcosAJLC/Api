import { Router } from "express";
import UserC from "../controllers/UserController.js";
import LoginReq from "../middlewares/LoginReq.js";

const router = new Router();

router.post("/", UserC.store);
router.put("/", LoginReq, UserC.update);
router.delete("/", LoginReq, UserC.delete);
export default router;
