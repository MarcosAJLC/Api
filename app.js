import dotenv from "dotenv";
dotenv.config();
import express from "express";
import homeR from "./src/routes/homeRoutes.js";
import userR from "./src/routes/userRoutes.js";
import tokenR from "./src/routes/TokenRoutes.js";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  routes() {
    this.app.use("/", homeR);
    this.app.use("/users/", userR);
    this.app.use("/tokens/", tokenR);
  }
}
export default new App().app;
