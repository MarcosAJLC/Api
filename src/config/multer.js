import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, extname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.memoryStorage();
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
