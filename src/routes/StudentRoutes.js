import { Router } from "express";
import AlunoC from "../controllers/StudentController.js";
import LoginReq from "../middlewares/LoginReq.js";

const router = new Router();

router.get("/", AlunoC.index);
router.post("/", LoginReq, AlunoC.store);
router.put("/:id", LoginReq, AlunoC.update);
router.get("/:id", AlunoC.show);
router.delete("/:id", LoginReq, AlunoC.delete);

export default router;
