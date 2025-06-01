import { Router } from "express";
import { blandas, coorporativas, login, menu, objetivo, registro } from "../controllers/home.controller.js";

const rutaHome = Router();

rutaHome.get("/", login);
rutaHome.get("/menu", menu);
rutaHome.get("/objetivo", objetivo);
rutaHome.get("/registro", registro);
rutaHome.get("/coorporativas", coorporativas);
rutaHome.get("/blandas", blandas);

export default rutaHome;
