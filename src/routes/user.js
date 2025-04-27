import { Router } from "express";
import UserC from "../controllers/User.js";

const router = new Router();

router.post("/", UserC.store);
export default router;
