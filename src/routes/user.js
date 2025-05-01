import { Router } from "express";
import UserC from "../controllers/User.js";

const router = new Router();

router.post("/", UserC.store);
router.get("/", UserC.index);
router.get("/:id", UserC.show);
router.put("/:id", UserC.update);
export default router;
