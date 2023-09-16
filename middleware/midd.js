import express from "express";

// Middleware para validar los permisos
const checkPermissions = (req, res, next) => {
  const userRol = req.user.rol;
  const permissions = req.session.permissions;

  if (!permissions.includes(userRol)) {
    return res.status(403).json({
      message: "No tienes permiso para acceder a esta tabla"
    });
  }

  next();
};

// Middleware para guardar el rol del usuario en la sesión
const saveRol = (req, res, next) => {
  const userRol = req.user.rol;
  req.session.rol = userRol;

  next();
};

export { checkPermissions, saveRol };