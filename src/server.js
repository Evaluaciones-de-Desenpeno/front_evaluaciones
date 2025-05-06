import { config } from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ruta from "./routers/index.js";
config();


const __filename = fileURLToPath(import.meta.url);
const __diranem = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__diranem, "views"));
app.use(express.static(path.join(__diranem, "public")));
app.use(express.static("public"));


app.set("PORT", process.env.PORT || 2000);


app.use("/", ruta);

app.use(( req,res, next ) =>{
    res.status(404).render('views.error.404.ejs');
});

export default app;