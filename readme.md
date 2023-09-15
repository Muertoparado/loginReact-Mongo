ayuda consulta // Importar el cliente de MongoDB
const MongoClient = require("mongodb");

// Conectar a la base de datos
const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

// Obtener la base de datos
const db = client.db("myDatabase");

// Obtener la colección
const collection = db.collection("myCollection");

// Crear la regla de colección
const rule = {
  database: "myDatabase",
  collection: "myCollection",
  roles: [
    {
      name: "myRole",
      document_filters: {
        read: { "userId": { "$eq": "$__session__.userId" } },
        write: { "userId": { "$eq": "$__session__.userId" } }
      },
      insert: true,
      delete: true,
      search: true,
      fields: {
        "myField": { "read": true, "write": true }
      },
      additional_fields: { "read": true, "write": true }
    }
  ],
  filters: []
};

// Agregar la regla de colección
await collection.createRule(rule);

// Desconectar de la base de datos
await client.close();