import dotenv from 'dotenv';
import express from 'express';
import { saveRol,checkPermissions } from './middleware/midd.js';
dotenv.config();

let app = express();

app.use(express.json());
//app.use(saveRol);
app.use("/login",saveRol);
app.use("/t",checkPermissions,)

let config = JSON.parse(process.env.MY_SERVER);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});