import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Login required" });
  }

  const [, token] = authHeader.split(" ");
  try {
    const dados = jwt.verify(token, process.env.Token);
    const { id, email } = dados;
    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (e) {
    return res.status(401).json({ erro: "Token Expirado ou Inválido" });
  }
};
