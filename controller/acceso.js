  import rol from '../login/rules.json' assert { type: 'json' };
  import crypto from 'crypto';
  import bcrypt from 'bcrypt';
  /*
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
  */



  export function generateSalt() {
    try {
      const saltRounds = parseInt(process.env.BCRYPT_SALT);
      const salt = bcrypt.genSaltSync(saltRounds).toString(); // Convierte la sal en cadena
      return salt;
    } catch (error) {
      console.error(error);
      throw new Error('Error al generar la sal');
    }
  }

  export async function hashPassword(password, salt) {
    try {
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      console.error(error);
      throw new Error('Error al hashear la contraseña');
    }
  }
