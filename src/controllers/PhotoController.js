import db from "../../config/database.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

class PhotoController {
  async store(req, res) {
    try {
      const file = req.file;
      const { student_id } = req.body;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!student_id) {
        return res.status(400).json({ error: "student ID is required" });
      }

      const { data: student, error: studentError } = await db
        .from("student")
        .select("id")
        .eq("id", student_id)
        .single();

      if (studentError || !student) {
        return res.status(400).json({ error: "Student not found" });
      }

      const { data: oldPhotos } = await db
        .from("photo")
        .select("*")
        .eq("student_id", student_id);

      if (oldPhotos && oldPhotos.length > 0) {
        for (const oldPhoto of oldPhotos) {
          const urlPath = oldPhoto.url.split(
            "/storage/v1/object/public/photo/",
          )[1];
          if (urlPath) {
            await db.storage.from("photo").remove([urlPath]);
          }
          await db.from("photo").delete().eq("id", oldPhoto.id);
        }
      }

      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `students/${fileName}`;

      const { error: uploadError } = await db.storage
        .from("photo")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicUrlData } = db.storage
        .from("photo")
        .getPublicUrl(filePath);

      const url = publicUrlData.publicUrl;

      const { data, error } = await db
        .from("photo")
        .insert([{ student_id, url }])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data[0]);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new PhotoController();
