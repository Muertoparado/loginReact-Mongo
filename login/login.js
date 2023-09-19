import express from "express";
import Users from "../models/Users";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  const token = await generateToken();

  res.status(200).json({
    token,
    rol: user.rol
  });
});

export default router;