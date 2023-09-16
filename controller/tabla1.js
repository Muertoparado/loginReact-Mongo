import { con} from "../db/atlas.js";
import { ObjectId } from "mongodb";

export async function getTabla(req, res) {
    try {
        let db = await con();
        let colleccion = db.collection("tabla1");
        let results = await colleccion.find({}).sort({ _id: 1 }).toArray();
        results.length > 0 ? res.send(results).status(200) : res.status(404).send({ status: 404, message: "No Encontrado" })
    } catch (error) {
        console.log(error); 
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
}

export async function gettablaId(req, res) {
    try {
        const db = await con();
        const collection = db.collection("tabla1");
        const tablaId = parseInt(req.params.id);

        const tabla = await collection.findOne({ id:tablaId });

        if (!tabla) {
            return res.status(404).send({ status: 404, message: "tabla no encontrado" });
        }

        res.status(200).json(tabla);
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: "Error interno del servidor" });
    }
};

export async function postTabla(req, res){
    try{
        let db = await con();
        let colleccion = db.collection("tabla1");
        let data = req.body;
        const newtabla = {
            _id: new ObjectId(),
            ...data,
        };
        await colleccion.insertOne(newtabla);
        res.status(201).send({ status:201, message: "Created" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status:500, message: "Internal Server Error" });
    }
};

export async function deleteTabla(req, res){
    try{
        let db = await con();
        console.log("connect delete");
        let colleccion = db.collection("tabla1");
        const tablaId = parseInt(req.params.id);

        const tabla = await colleccion.findOne({ id: tablaId });

        if (!tabla) {
            return res.status(404).send({ status: 404, message: "tabla no encontrado" });
        }

        const deletionResult = await colleccion.deleteOne({ id: tablaId });
        //console.log(deletionResult);
        res.status(200).send({ status:200, message: "Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status:500, message: "Internal Server Error" });
    }
};