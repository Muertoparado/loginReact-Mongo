import { SignJWT, jwtVerify } from "jose";
import { connect } from "../../db/connection.js";
import { ObjectId } from "mongodb";
import config from "../utils/config.js";

const db = await connect();
const coleccion = await db.collection('prueba'); // Depende de cual coleccion se validara con permisos

export const createToken = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) return res.status(400).send({message: "Not enough data"});

    const { name, password } = req.body;
    if (!name || !password) return res.status(417).send({ message: "Must provide name and password" });

    const result = await coleccion.findOne(req.body)
    if (!result) return res.status(401).send({message: "Not authorized"});

    const id = result._id.toString();
    const jwtConstructor = await new SignJWT({ id: id})
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime('3h')
        .sign(Buffer.from(process.env.JWT_PRIVATE_KEY, 'utf-8'));
    req.data = {status: 200, message: jwtConstructor};
    next();
}

export const verifyToken = async (req, token) => {
    const jwt = await jwtVerify(token, Buffer.from(process.env.JWT_PRIVATE_KEY, 'utf-8'));
    if (!jwt) return false;

    const id = jwt.payload.id;
    const result = await coleccion.findOne({
        _id: new ObjectId(id),
        [`allowances.${req.baseUrl}`]: `${req.headers["accept-version"]}`
    });

    if (!result) return false;

    return result;
};