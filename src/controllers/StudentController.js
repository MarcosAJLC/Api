import supabase from "../../config/database.js";
import validator from "validator";
class StudentC {
  async index(req, res) {
    const created_by = req.userId;
    const { data: student, error: errorInsercao } = await supabase
      .from("student")
      .select(
        `
        id,
        nome,
        sobrenome,
        email,
        idade,
        peso,
        altura,
        photo ( id, url)
      `,
      )
      .eq("created_by", created_by);
    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(201).json(student);
  }
  async search(req, res) {
    const id = req.userId;
    const { search, email, nome, sobrenome } = req.body;
    try {
      let query = supabase
        .from("student")
        .select(
          `
        id,
        nome,
        sobrenome,
        email,
        idade,
        peso,
        altura,
        photo ( id, url)
      `,
        )
        .eq("created_by", id);

      if (search?.trim()) {
        const termo = search.trim();
        query = query.or(`
        nome.ilike.%${termo}%,
        sobrenome.ilike.%${termo}%,
        email.ilike.%${termo}%
      `);
      } else if (email?.trim()) {
        query = query.ilike("email", `%${email.trim()}%`);
      } else if (nome?.trim()) {
        query = query.ilike("nome", `%${nome.trim()}%`);
      } else if (sobrenome?.trim()) {
        query = query.ilike("sobrenome", `%${sobrenome.trim()}%`);
      }

      const { data, error } = await query;

      if (error) {
        return res
          .status(400)
          .json({ errors: ["Search failed: " + error.message] });
      }

      return res.status(200).json(data);
    } catch (e) {
      console.error("Unexpected error during search:", e);
      return res.status(500).json({ errors: ["Internal server error."] });
    }
  }

  async store(req, res) {
    const created_by = req.userId;
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
      const { data: UsuarioComEmail, erro: erroEmail } = await supabase
        .from("student")
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

    const { data: novostudent, error: errorInsercao } = await supabase
      .from("student")
      .insert([
        {
          nome,
          sobrenome,
          email,
          idade,
          peso,
          altura,
          created_by,
        },
      ])
      .select("nome, sobrenome, email, idade, peso, altura");

    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(201).json(novostudent);
  }
  async update(req, res) {
    const { id } = req.params;
    const created_by = req.userId;
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
      const { data: UsuarioComEmail, erro: erroEmail } = await supabase
        .from("student")
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
    const { data: novostudent, error: errorInsercao } = await supabase
      .from("student")
      .update(updates)
      .eq("id", Number(id))
      .eq("created_by", created_by)
      .select("nome, sobrenome, email, idade, peso, altura");
    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(200).json(novostudent);
  }
  async show(req, res) {
    try {
      const created_by = req.userId;
      const { id } = req.params;
      if (!id) {
        return res
          .status(404)
          .json("The ID was either not provided or could not be located.");
      }

      const { data: student, error: errorInsercao } = await supabase
        .from("student")
        .select("*")
        .eq("created_by", created_by)
        .eq("id", Number(id))
        .single();
      if (errorInsercao) {
        return res.status(400).json({ erro: errorInsercao.message });
      }
      if (!student) {
        return res.status(404).json("Student not found");
      }
      return res.status(201).json(student);
    } catch (e) {
      return res
        .status(400)
        .json({ errors: e.errors.map((err) => err.message) });
    }
  }
  async delete(req, res) {
    try {
      const created_by = req.userId;
      const { id } = req.params;
      if (!id) {
        return res
          .status(404)
          .json("The ID was either not provided or could not be located.");
      }

      const { data: student, error: errorInsercao } = await supabase
        .from("student")
        .delete()
        .select("nome, sobrenome, email, idade, peso, altura")
        .eq("created_by", created_by)
        .eq("id", Number(id));
      if (errorInsercao) {
        return res.status(400).json({ erro: errorInsercao.message });
      }
      if (!student) {
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

export default new StudentC();
