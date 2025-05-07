import { Router } from "express";
import { historial, login } from "../controllers/home.controller.js";

const rutaHome = Router();

rutaHome.get("/", login);
rutaHome.get("/historial", historial);

export default rutaHome;
