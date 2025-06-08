import db from "../../config/database.js";
import bcrypt from "bcrypt";
import validator from "validator";

class UserC {
  async store(req, res) {
    const nome = "Marcos Alexandre";
    const email = "marcosalexandrejlc@gmail.com";
    const password = "emigam2008";
    if (nome && (nome.length < 3 || nome.length > 255)) {
      return res.status(400).json({
        erro: "Invalid name,please enter a name between 3 and 255 caracters",
      });
    }

    if (password.length < 6 || password.length > 255) {
      return res
        .status(400)
        .json(
          "The password provided invalid, must contain between 6 and 50 caracters",
        );
    }

    const password_hash = await bcrypt.hash(password, 8);
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json("The email address provided is either invalid or already in use");
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
      return res.status(500).json({ erro: "Internal server erro." });
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
        return res
          .status(400)
          .json({ erro: "The specified user could not be found." });
      }
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ erro: "Internal server erro" });
    }
  }
  async update(req, res) {
    try {
      const id = req.userId;
      if (!id) {
        return res.status(400).json({
          erro: "Authentication required. Please sign in to continue.",
        });
      }

      const { nome, email, password } = req.body;
      const updates = {};

      if (nome && (nome.length < 3 || nome.length > 255)) {
        return res.status(400).json({
          erro: "Invalid name,please enter a name between 3 and 255 caracters",
        });
      } else if (nome) {
        updates.nome = nome;
      }

      if (email) {
        if (!validator.isEmail(email)) {
          return res
            .status(400)
            .json({ erro: "The email address provided is either invalid" });
        }
        const { data: UsuarioComEmail, erro: erroEmail } = await db
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (UsuarioComEmail && UsuarioComEmail.id !== id) {
          return res.status(400).json({
            erro: "This email address is already associated with an existing account.",
          });
        }
        updates.email = email;
      }
      if (password) {
        if (password.length < 6 || password.length > 50) {
          return res.status(400).json({
            erro: "The password provided invalid, must contain between 6 and 50 caracters",
          });
        }
        updates.password_hash = await bcrypt.hash(password, 8);
      }
      updates.updated_at = new Date().toISOString();
      const { data, error } = await db
        .from("users")
        .update(updates)
        .eq("id", Number(id))
        .select("id,nome,email");

      if (error || !data || data.length === 0) {
        return res.status(404).json({ erro: "User not found by ID" });
      }
      return res.status(200).json(data[0]);
    } catch (e) {
      return res.status(500).json({ erro: "Internal server erro" });
    }
  }
  async delete(req, res) {
    try {
      const id = req.userId;
      if (!id) {
        return res.status(400).json({ erro: "Id was not provided" });
      }

      const { data, error } = await db
        .from("users")
        .delete()
        .eq("id", Number(id))
        .select("*");

      if (error || !data || data.length === 0) {
        return res.status(404).json({ erro: "User not found by ID" });
      }

      return res.status(200).json(data[0]);
    } catch (e) {
      return res.status(500).json({ erro: "Internal server erro" });
    }
  }
}

export default new UserC();
