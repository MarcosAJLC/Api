import { Router } from "express";
import TokenC from "../controllers/TokenController.js";

const router = new Router();

router.post("/", TokenC.store);
export default router;
