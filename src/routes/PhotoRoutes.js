import { Router } from "express";
import PhotoC from "../controllers/PhotoController.js";
import multer from "multer";
import multerConfig from "../config/multer.js";

const upload = multer(multerConfig);

const router = new Router();

router.post("/", upload.single("Upload"), PhotoC.store);
export default router;
