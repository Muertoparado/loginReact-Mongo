import express from "express";
import { limitQuery } from "../limit/config.js";
import { logIn } from "../controller/registar.js";

function configurarApp() {
    const app = express();
    app.use(express.json());
    return app;
}

const appLogin = configurarApp();

appLogin.get("/login",limitQuery(),logIn);
appLogin.get("/users/:id",limitQuery(),getUserId);
appLogin.post("/login",limitQuery(),postUsers);
appLogin.delete("/users/:id",limitQuery(),deleteUser);