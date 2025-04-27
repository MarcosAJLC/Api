import bcrypt from "bcrypt";
import db from "../../config/database.js";
import validator from "validator";

async function Validar() {
  const senha = await db.from("users").select("password_hash");
  const email = await db.from("users").select("email");
  if (senha.length < 3 || senha.length > 255) {
    console.log("senha inválida, precisa conter entre 3 e 50 caracteres");
    return;
  }
  const senhaC = bcrypt.hash(senha, 8);
  const nome = await db.from("users").select("nome");

  if (nome.length < 3 || nome.length > 255) {
    console.log("nome inválido,precisa ter entre 3 e 255 caracteres");
    return;
  }
  if (!validator.isEmail(email)) {
    console.log("email inválido");
    return;
  }

  const { data, erro } = await db.from("users").update([
    {
      Email: email,
      password_hash: senhaC,
    },
  ]);
  if (erro) {
    console.log("erro ao criar o usuario", erro);
  } else {
    console.log("Usuario criado com sucesso", data);
  }
}

Validar();
