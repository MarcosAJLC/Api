import dotenv from "dotenv";
dotenv.config();
import express from "express";
import homeR from "./src/routes/home.js";
import userR from "./src/routes/user.js";

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
  }
}
export default new App().app;
