import { Router } from "express";
import StudentC from "../controllers/StudentController.js";
import LoginReq from "../middlewares/LoginReq.js";

const router = new Router();

// router.get("/", StudentC.index);
router.post("/", LoginReq, StudentC.store);
router.put("/:id", LoginReq, StudentC.update);
// router.get("/:id", StudentC.show);
router.delete("/:id", LoginReq, StudentC.delete);
router.post("/search/", LoginReq, StudentC.search);

export default router;
