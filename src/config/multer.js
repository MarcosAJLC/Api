import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, extname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolve(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const aleatorio = Math.floor(Math.random() * 10000 + 10000);
    cb(null, `${Date.now()}_${aleatorio}${extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFiles = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedFiles.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG and PNG are allowed."),
        false,
      );
    }
    cb(null, true);
  },
});

export default upload;
