
import express from "express";
import { authMiddleware } from "./auth.mjs";

// Crear la aplicación

// auth.mjs

// Importar las dependencias
import express from "express";
import session from "express-session";

// Crear el middleware de autenticación
const authMiddleware = async (req, res, next) => {
  // Comprobar si el usuario está autenticado
  if (!req.session.userId) {
    // Redirigir al usuario a la página de inicio de sesión
    res.redirect("/login");
    return;
  }

  // Agregar el ID del usuario a la solicitud
  req.userId = req.session.userId;

  // Continuar con la siguiente solicitud
  next();
};

// Exportar el middleware de autenticación
export { authMiddleware };
const app = express();

// Utilizar el middleware de autenticación
app.use(authMiddleware);

// Rutas de la aplicación
app.get("/", (req, res) => {
  // Acceder al ID del usuario de la solicitud
  const userId = req.userId;

  // Mostrar una página de bienvenida al usuario
  res.send("Bienvenido, usuario " + userId);
});