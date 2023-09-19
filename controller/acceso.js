import rol from '../login/rules.json';


export async  function permisos(){
  let db = await con();
  let colleccion = db.collection("rol");


  const hasPermission = roles.colleccion.find((colleccion) => {
    return (
      colleccion.name === req.params.table &&
      colleccion.roles.find((role) => {
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

}
const roles = await Roles.findOne({ database: "prueba" });

// Obtener el rol del usuario
const userRole = req.user.role;

// Verificar si el usuario tiene permiso para acceder a la tabla


// Si el usuario tiene permiso, permitirle acceder a la tabla
// ...
