import multer from "multer";
import db from "../../config/database.js";
import multerconfig from "../config/multer.js";

const upload = multer(multerconfig).single("Upload");

class PhotoC {
  async store(req, res) {
    const originalname = await db.from("photo").select("originalname");
    const filename = await db.from("photo").select("filename");
    if (originalname.lenght === 0) {
      return res.status(400).json("This field cannot be empty.");
    }
    if (filename.lenght === 0) {
      return res.status(400).json("This field cannot be empty.");
    }
    return upload(req, res, (error) => {
      if (error) {
        res.status(400).json({ errors: [error] });
      }
      return res.status(201).json(req.file);
    });
  }
}

export default new PhotoC();
