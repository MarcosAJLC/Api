import db from "../../config/database.js";
import bcrypt from "bcrypt";
import validator from "validator";

class UserC {
  async store(req, res) {
    const nome = "Marcos Alexandre";
    const email = "marcosalexandrejlc@gmail.com";
    const password = "emigam2008";

    if (password.length < 6 || password.length > 255) {
      console.log("senha inválida, precisa conter entre 6 e 50 caracteres");
      return res
        .status(400)
        .json("senha inválida, precisa conter entre 3 e 50 caracteres");
    }

    const password_hash = await bcrypt.hash(password, 8);
    if (nome.length < 3 || nome.length > 255) {
      console.log("nome inválido,precisa ter entre 3 e 255 caracteres");
      return res
        .status(400)
        .json("nome inválido, precisa ter entre 3 e 255 caracteres");
    }
    if (!validator.isEmail(email)) {
      console.log("email inválido");
      return res.status(400).json("email inválido ou já existe");
    }

    const { data: novoUser, error: errorInsercao } = await db
      .from("users")
      .insert({
        nome,
        email,
        password_hash,
      })
      .select("id,nome,email");

    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(201).json({ data: novoUser });
  }

  async index(req, res) {
    try {
      const { data: users, error } = await db
        .from("users")
        .select("id, nome, email");

      if (error) {
        return res.status(400).json({ erro: error.message });
      }

      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ erro: "Erro interno do servidor." });
    }
  }
  async show(req, res) {
    try {
      const { id } = req.params;
      const { data: user, error } = await db
        .from("users")
        .select("id, nome, email, created_at")
        .eq("id", id)
        .single();
      if (error) {
        return res.status(400).json({ erro: "usuario não encontrado" });
      }
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }
  async update(req, res) {
    try {
      const id = req.userId;
      if (!id) {
        return res.status(400).json({ erro: "Usuário não autenticado" });
      }
      console.log("id recebido:", req.userId);

      const { nome, email, password } = req.body;
      const updates = {};

      if (nome && (nome.length < 3 || nome.length > 255)) {
        return res.status(400).json({ erro: "Nome inválido" });
      } else if (nome) {
        updates.nome = nome;
      }

      if (email && !validator.isEmail(email)) {
        return res.status(400).json({ erro: "Email inválido" });
      } else if (email) {
        updates.email = email;
      }

      if (password) {
        if (password.length < 6 || password.length > 50) {
          return res.status(400).json({ erro: "Senha inválida" });
        }
        updates.password_hash = await bcrypt.hash(password, 8);
      }
      updates.updated_at = new Date().toISOString();

      const { data, error } = await db
        .from("users")
        .update(updates)
        .eq("id", id)
        .select("*");

      if (error || !data || data.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado por id" });
      }

      return res.status(200).json(data[0]);
    } catch (e) {
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }
  async delete(req, res) {
    try {
      const id = req.userId;
      if (!id) {
        return res.status(400).json({ erro: "Id não fornecido" });
      }

      const { data, error } = await db
        .from("users")
        .delete()
        .eq("id", Number(id))
        .select("*");

      if (error || !data || data.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado por id" });
      }

      return res.status(200).json(data[0]);
    } catch (e) {
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }
}

export default new UserC();
