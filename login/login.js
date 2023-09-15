// Importar el cliente de MongoDB
const MongoClient = require("mongodb");

// Conectar a la base de datos
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

// Obtener la base de datos
const db = client.db("myDatabase");

// Crear las reglas de colección
const rules = await db.collection("rules").createMany(
  require("path/to/rules.json")
);

// Desconectar de la base de datos
await client.close();