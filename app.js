import dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import homeR from "./src/routes/homeRoutes.js";
import userR from "./src/routes/userRoutes.js";
import tokenR from "./src/routes/TokenRoutes.js";
import StudentC from "./src/routes/StudentRoutes.js";
import PhotoC from "./src/routes/PhotoRoutes.js";
import { resolve } from "path";
import cors from "cors";
import helmet from "helmet";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorsHandle();
  }

  middlewares() {
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
      );
      next();
    });
    const whiteList = [
      "http://localhost:5173",
      "https://marcos-s-projects-7b4a11c3.vercel.app",
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(resolve("uploads")));
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
