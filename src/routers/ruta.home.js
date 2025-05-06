import { Router } from "express";
import { login } from "../controllers/home.controller.js";

const rutaHome = Router();

rutaHome.get("/", login);

export default rutaHome;
