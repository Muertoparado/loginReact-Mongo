//import Login from '../storage/dtoLogin.js'
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import Login from '../storage/login.js'
import { hashPassword} from './acceso.js';
import {con} from '../db/atlas.js'
import {generateSalt} from './acceso.js'
import { validationResult } from 'express-validator';
import { ObjectId } from 'mongodb';

// Generar un token JWT
const generateJWTToken = async (user, privateKey) => {
const jws = await SignJWT.sign({ user }, privateKey, {
alg: 'RS256',
});

return jws.compact();
};

// Verificar un token JWT
const verifyJWTToken = async (token, publicKey) => {
	const jws = await jwtVerify(token, publicKey);

	return jws.payload;
};


export async function registerlogin(req, res) {
	const { name, password, email } = req.body;
  
	// Validar los datos de entrada utilizando express-validator
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(400).json({ errors: errors.array() });
	}
  
	try {
		const db = await con();
		let colleccion = db.collection("user");

		// Generar una sal segura
		const salt = generateSalt();

		// Generar un hash de contraseña seguro
		const hashedPassword = await hashPassword(password, salt);

		const login = new Login({
			name,
			
			email,
	});

	//const newlogin = await login.save(db);

	
	let data = req.body;
        const newlogin = {
            _id: new ObjectId(),
            ...data,
			password: hashedPassword,
        };
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
	  // Captura errores específicos y proporciona mensajes de error descriptivos
	if (err.code === 11000) {
	return res.status(400).json({ message: "El correo electrónico ya está en uso" });
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
	const login = await Login.findOne(db,{ email });

	if (!login) {
		return res.status(401).json("login not found");
	}

  	const isPasswordValid = await bcrypt.compare(password, user.password);

  	if (!isPasswordValid) {
    	return res.status(401).json({ message: "Contraseña incorrecta" });
  }

	if (await bcrypt.compare(password, login.password)) {
		const token = await generateJWTToken(login, process.env.JWT_PRIVATE_KEY);
		const { password, ...others } = login._doc;
		res.cookie("jwt", token, { httpOnly: true });
		return res.status(200).json({ ...others, token });
	}

	res.status(401).json("Wrong credentials!");
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
	//  logout the login by destroying the token
	//  and return a success message

	res.cookie("jwt", "", { maxAge: 1 });
	res.redirect("/");
};
