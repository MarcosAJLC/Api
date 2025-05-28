import db from "../../config/database.js";

class PhotoC {
  async store(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ errors: ["No file uploaded."] });
      }
      const { originalname, filename } = req.file;
      const { student_id } = req.body;
      const urlConfig = "http://localhost:3001/";
      const url = `${urlConfig}${filename}`;

      if (!student_id) {
        return res.status(400).json({ errors: ["student ID is required"] });
      }
      const { data: student, error: errorstudent } = await db
        .from("student")
        .select("id")
        .eq("id", student_id)
        .single();

      if (errorstudent || !student) {
        return res.status(400).json({ errors: ["Student not found"] });
      }

      if (!originalname || originalname.length === 0) {
        return res
          .status(400)
          .json({ errors: ["Original name cannot be empty."] });
      }

      if (!filename || filename.length === 0) {
        return res.status(400).json({ errors: ["Filename cannot be empty."] });
      }

      const { data: photo, error: errorinsert } = await db
        .from("photo")
        .insert({ originalname, filename, student_id, url })
        .select("originalname, filename, student_id, url");

      if (errorinsert) {
        return res.status(500).json({ errors: [errorinsert.message] });
      }
      return res.status(201).json(photo);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}

export default new PhotoC();
