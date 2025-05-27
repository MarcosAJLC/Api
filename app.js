import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import homeR from "./src/routes/homeRoutes.js";
import userR from "./src/routes/userRoutes.js";
import tokenR from "./src/routes/TokenRoutes.js";
import StudentC from "./src/routes/StudentRoutes.js";
import PhotoC from "./src/routes/PhotoRoutes.js";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorsHandle();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  routes() {
    this.app.use("/", homeR);
    this.app.use("/users/", userR);
    this.app.use("/tokens/", tokenR);
    this.app.use("/student/", StudentC);
    this.app.use("/photo/", PhotoC);
  }
  errorsHandle() {
    this.app.use((err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ erro: err.message });
      }

      if (err instanceof Error) {
        return res.status(400).json({ erro: err.message });
      }

      return res.status(500).json({ erro: "Internal server erro" });
    });
  }
}
export default new App().app;
