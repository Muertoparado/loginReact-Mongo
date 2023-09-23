//import Login from '../storage/dtoLogin.js'
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import Login from '../storage/login.js'
import { hashPassword} from './acceso.js';
import {con} from '../db/atlas.js'
import {generateSalt} from './acceso.js'
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';
import { createToken, verifyTokenMiddleware} from '../limit/token.js';
// Generar un token JWT
const generateJWTToken =createToken;


// Verificar un token JWT
const verifyJWTToken = verifyTokenMiddleware;


export async function registerlogin(req, res) {
	const { name, password, email } = req.body;
	//let data = req.body;
	const errors = validationResult(req);
	
	if (!errors.isEmpty()) return res.status(401).json({ errores: errors.array() });
	
	try {
		const db = await con();
		let colleccion = db.collection("user");

		// Generar una sal segura
		const salt = generateSalt();

		// Generar un hash de contraseña seguro
		const hashedPassword = await hashPassword(password, salt);
	
		const newlogin = {
            _id: new ObjectId().toString(),
			name: name,
			email: email,
    		password: hashedPassword, // Include only the hashed password
    };
		console.log("Inserting document:", newlogin);
        await colleccion.insertOne(newlogin);
		
		
	if (newlogin) {
		console.log("enviado");
		return res.status(201).json(newlogin);
	} else {
	return res.status(500).json({
		message: "Login not created",
	});
	}
} catch (err) {
	console.error("Error al insertar documento:", err);
	if (err.code === 11000) {
	  return res.status(400).json({ message: "El correo electrónico ya está en uso" });
	} else if (err.code === 121) {
	  // Handle validation error more explicitly
	  return res.status(400).json({ message: "Documento no válido. Verifique los datos enviados." });
	}
	return res.status(500).json({ message: err.message });
  }
}
/*
export async function registerlogin (req, res){
	const { name, password, email } = req.body;

	if (!email) {
		return res.status(400).json({
			message: "Invalid email"
		});
	}
	if (!password) {
		return res.status(400).json({
			message: "Invalid Password"
		});
	}

	const db = await con();
	const salt = generateSalt();
	const hashedPassword = await hashPassword(password, salt);

	const login = new Login({
		name,
		password: hashedPassword,
		email
});
	try {
		const newlogin = await login.save(db);
		if (newlogin) {
			return res.status(201).json(newlogin);
		} else {
			return res.status(500).json({
				message: "login not created"
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: err
		});
	}
};  */
export async function logIn (req, res){	
	const { email, password } = req.body;

	try{

	const db = await con();
	let colleccion = db.collection("user");
	const login = await colleccion.findOne({email });
		console.log(login);
	if (!login) {
		return res.status(401).json("login not found");
	}

  	//const isPasswordValid = await bcrypt.compare(password, user.password);

	const isPasswordValid = await bcrypt.compare(password, login.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: "Contraseña incorrecta" });
}

	if (await bcrypt.compare(password, login.password)) {
		/*const token = await generateJWTToken(login, process.env.JWT_PRIVATE_KEY);
		const { password, ...others } = login._doc;
		res.cookie("jwt", token, { httpOnly: true });
		return res.status(200).json({ ...others, token });
	}*/
	const token = await createToken(login);
	res.cookie("jwt", token, { httpOnly: true, expires: 0 }); // La cookie expirará cuando se cierre el navegador
	return res.status(200).json({ token });
}

	res.status(401).json("Wrong credentials!");
}catch(error){
	console.log(error);
	return res.status(500).json({ message: "Error interno del servidor" });
}
};	

export async function changePassword (req, res) {
	const { password } = req.body;

	if (!password || typeof password !== "string") {
		return res.status(400).json({
			message: "Invalid Password"
		});
	}
	const _id = req.login.id;
	const hasedPassowrd = await bcrypt.hash(
		password,
		parseInt(process.env.BCRYPT_SALT)
	);

	try {
		const updatedlogin = await Login.updateOne(
			{ _id },
			{
				$set: { hasedPassowrd }
			}
		);
		res.status(200).json(updatedlogin);
	} catch {
		return res.status(500).json({
			message: "Server Error"
		});
	}
};

export async function logout (req, res) {
	console.log("finish");
	res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out" });
};
