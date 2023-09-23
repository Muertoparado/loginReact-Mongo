import { body } from "express-validator";


const name= body("name").trim().notEmpty().withMessage("Parametros vacios!!")
        .isString().withMessage("Tipo de dato incorrecto!").isLength({min:3})

const email= body("email").trim().notEmpty().withMessage("Parametros vacios!!")
        .isEmail().withMessage("Parametro email invalido!")
        .isString().withMessage("Tipo de dato incorrecto!")
    
const password =  body("password").trim().notEmpty().withMessage("Parametros vacios!!")
        .isString().withMessage("Tipo de dato incorrecto!").isLength({min:6})


const regLogin = [name, email,password];
const loginUser =[email,password];
export {regLogin,loginUser};
//exports.loginUser = body.object({email,password});
