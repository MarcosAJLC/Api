import db from "../../config/database.js";
import validator from "validator";
class AlunoC {
  async index(req, res) {
    const { data: aluno, error: errorInsercao } = await db
      .from("alunos")
      .select("*");
    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(201).json(aluno);
  }
  async store(req, res) {
    const { nome, sobrenome, email, idade, peso, altura } = req.body;
    if (nome.length < 3 || nome.length > 255) {
      return res
        .status(400)
        .json("Invalid name,please enter a name between 3 and 255 caracters");
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
      return res
        .status(400)
        .json(
          "The last name provided is invalid,it must contain between 3 and 255 caracters",
        );
    }
    if (email) {
      if (!validator.isEmail(email)) {
        return res
          .status(400)
          .json({ erro: "The email address provided is either invalid" });
      }
      const { data: UsuarioComEmail, erro: erroEmail } = await db
        .from("alunos")
        .select("id")
        .eq("email", email)
        .single();

      if (UsuarioComEmail) {
        return res.status(400).json({
          erro: "This email address is already associated with an existing account.",
        });
      }
    }
    if (idade && !Number.isInteger(idade)) {
      return res.status(400).json("Age must be an integer");
    }
    if (peso && isNaN(peso)) {
      return res.status(400).json("Weight must be a numeric value");
    }
    if (altura && isNaN(altura)) {
      return res.status(400).json("Height must be a numeric value");
    }

    const { data: novoaluno, error: errorInsercao } = await db
      .from("alunos")
      .insert([
        {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
        },
      ])
      .select("*");

    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(201).json(novoaluno);
  }
  async update(req, res) {
    const { id } = req.params;
    const { nome, email, sobrenome, idade, peso, altura } = req.body;
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
    if (sobrenome && (sobrenome.length < 3 || sobrenome.length > 255)) {
      return res
        .status(400)
        .json(
          "The last name provided is invalid,it must contain between 3 and 255 caracters",
        );
    } else if (sobrenome) {
      updates.sobrenome = sobrenome;
    }
    if (idade && !Number.isInteger(idade)) {
      return res.status(400).json("Age must be an integer");
    } else if (idade) {
      updates.idade = idade;
    }
    if (peso && isNaN(peso)) {
      return res.status(400).json("Weight must be a numeric value");
    } else if (peso) {
      updates.peso = peso;
    }
    if (altura && isNaN(altura)) {
      return res.status(400).json("Height must be a numeric value");
    } else if (altura) {
      updates.altura = altura;
    }

    updates.updated_at = new Date().toISOString();
    const { data: novoaluno, error: errorInsercao } = await db
      .from("alunos")
      .update(updates)
      .eq("id", Number(id))
      .select("nome, sobrenome, email, idade, peso, altura");
    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(200).json(novoaluno);
  }
  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(404)
          .json("The ID was either not provided or could not be located.");
      }

      const { data: aluno, error: errorInsercao } = await db
        .from("alunos")
        .select("*")
        .eq("id", Number(id))
        .single();
      if (errorInsercao) {
        return res.status(400).json({ erro: errorInsercao.message });
      }
      if (!aluno) {
        return res.status(404).json("Student not found");
      }
      return res.status(201).json(aluno);
    } catch (e) {
      return res
        .status(400)
        .json({ errors: e.errors.map((err) => err.message) });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(404)
          .json("The ID was either not provided or could not be located.");
      }

      const { data: aluno, error: errorInsercao } = await db
        .from("alunos")
        .delete()
        .select("*")
        .eq("id", Number(id));
      if (errorInsercao) {
        return res.status(400).json({ erro: errorInsercao.message });
      }
      if (!aluno) {
        return res.status(404).json("Student not found");
      }
      return res
        .status(201)
        .json("The student was successfully removed from the system.");
    } catch (e) {
      return res
        .status(400)
        .json({ errors: e.errors.map((err) => err.message) });
    }
  }
}

export default new AlunoC();
