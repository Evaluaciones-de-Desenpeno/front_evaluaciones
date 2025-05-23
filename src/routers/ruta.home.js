import { Router } from "express";
import { login, menu, objetivo } from "../controllers/home.controller.js";

const rutaHome = Router();

rutaHome.get("/", login);
rutaHome.get("/menu", menu);
rutaHome.get("/objetivo", objetivo);

export default rutaHome;
