import express from "express";
import { changePassword, logIn, logout, registerlogin } from "../controller/registar.js";
import { getTabla } from "../controller/tabla1.js";
import {loginUser, regLogin} from "../storage/dtoLogin.js";
import cookieParser from 'cookie-parser';
import session from 'express-session';
function configurarApp() {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(session({
        secret: process.env.JWT_PRIVATE_KEY, // Cambia esto por una clave secreta más segura
        resave: false,
        saveUninitialized: false,
      }));
    return app;
}

const appLogin = configurarApp();
const appUtil = configurarApp();

appLogin.post("/",loginUser,logIn);
appLogin.post("/register",regLogin,registerlogin);
appLogin.post("/cpass",changePassword);
appLogin.post("/fin",logout);

appUtil.get("/t",getTabla)


export {
    appLogin,
    appUtil
}