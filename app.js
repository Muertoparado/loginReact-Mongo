import dotenv from 'dotenv';
import express from 'express';
//import { saveRol,checkPermissions } from './middleware/midd.js';
import { appLogin, appUtil } from './routes/routes.js';
import { verifyTokenMiddleware } from './limit/token.js';
import cookieParser from 'cookie-parser';

dotenv.config();

let app = express();

app.use(express.json());
app.use(cookieParser());

//app.use(saveRol);
app.use("/login",appLogin);
app.use("/t",verifyTokenMiddleware,appUtil);

let config = JSON.parse(process.env.MY_SERVER);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});