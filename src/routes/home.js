import { Router } from "express";
import homeC from "../controllers/Home.js";

const router = new Router();

router.get("/", homeC.index);
export default router;
