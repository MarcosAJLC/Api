import db from "../../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class TokenC {
  async store(req, res) {
    const { email = "", password = "" } = req.body;
    if (!email || !password) {
      return res.status(401).json({ erro: "Email ou Senha não enviados" });
    }
    const { data: user, error } = await db
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !user) {
      return res.status(401).json({ erro: "Usuário não existe" });
    }
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ erro: "Senha inválida" });
    }
    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.Token, {
      expiresIn: process.env.Token_Expiration,
    });
    return res.status(201).json({ token });
  }
}

export default new TokenC();
