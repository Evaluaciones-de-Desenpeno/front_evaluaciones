import { Router } from "express";
import { login, menu } from "../controllers/home.controller.js";

const rutaHome = Router();

rutaHome.get("/", login);
rutaHome.get("/menu", menu);

export default rutaHome;
