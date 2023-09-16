// Importar el módulo `mongoose`
const mongoose = require("mongoose");

// Crear una conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/my_database", {
  useNewUrlParser: true,
});

// Crear el modelo `Roles`
const Roles = mongoose.model("Roles", {
  database: String,
  collections: Array,
});

// Obtener la configuración de roles y permisos
const roles = await Roles.findOne({ database: "prueba" });

// Obtener el rol del usuario
const userRole = req.user.role;

// Verificar si el usuario tiene permiso para acceder a la tabla
const hasPermission = roles.collections.find((collection) => {
  return (
    collection.name === req.params.table &&
    collection.roles.find((role) => {
      return role.name === userRole;
    })
  );
});

// Si el usuario no tiene permiso, devolver un error
if (!hasPermission) {
  return res.status(403).json({
    message: "No tienes permiso para acceder a esta tabla",
  });
}

// Si el usuario tiene permiso, permitirle acceder a la tabla
// ...
