import { body } from "express-validator";

const Login = [
    body("email").trim().notEmpty().withMessage("Parametros vacios!!")
        .isEmail().withMessage("Parametro email invalido!")
        .isString().withMessage("Tipo de dato incorrecto!"),
    
    body("password").trim().notEmpty().withMessage("Parametros vacios!!")
        .isString().withMessage("Tipo de dato incorrecto!").isLength({min:6})
]

export { Login };