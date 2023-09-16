//import Login from '../storage/dtoLogin.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

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

	const hashedPassword = await bcrypt.hash(
		password,
		parseInt(process.env.BCRYPT_SALT)
	);

	const login = new regLogin({
		name,
		password: hashedPassword,
		email
	});
	try {
		const newlogin = await login.save();
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
};

export async function logIn (req, res){
	const { email, password } = req.body;
	const login = await regLogin.findOne({ email });

	if (!login) {
		return res.status(401).json("login not found");
	}

	if (await bcrypt.compare(password, login.password)) {
		const token = jwt.sign(
			{
				id: login._id,
				email: login.email
			},
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: "365d" }
		);
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
		const updatedlogin = await regLogin.updateOne(
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
