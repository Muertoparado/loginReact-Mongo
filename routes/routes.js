import express from "express";
import { changePassword, logIn, registerlogin } from "../controller/registar.js";
import { getTabla } from "../controller/tabla1.js";

function configurarApp() {
    const app = express();
    app.use(express.json());
    return app;
}

const appLogin = configurarApp();
const appUtil = configurarApp();

appLogin.post("/",logIn);
appLogin.post("/register",registerlogin);
appLogin.post("/cpass",changePassword);

appUtil.get("/t",getTabla)


export {
    appLogin,
    appUtil
}