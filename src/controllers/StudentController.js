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
    name,
    lastname,
    email,
    age,
    weight,
    height,
    photo:photo!photo_student_id_fkey (
      id,
      url
    )
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
    const { search, email, name, lastname } = req.body;
    try {
      let query = supabase
        .from("student")
        .select(
          `
        id,
        name,
        lastname,
        email,
        age,
        weight,
        height,
        photo ( id, url)
      `,
        )
        .eq("created_by", id);

      if (search?.trim()) {
        const termo = search.trim();
        query = query.or(`
        name.ilike.%${termo}%,
        lastname.ilike.%${termo}%,
        email.ilike.%${termo}%
      `);
      } else if (email?.trim()) {
        query = query.ilike("email", `%${email.trim()}%`);
      } else if (name?.trim()) {
        query = query.ilike("name", `%${name.trim()}%`);
      } else if (lastname?.trim()) {
        query = query.ilike("lastname", `%${lastname.trim()}%`);
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
    const { name, lastname, email, age, weight, height } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ erro: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ erro: "The email address provided is invalid" });
    }

    // validação do nome
    if (!name || name.length < 3 || name.length > 255) {
      return res
        .status(400)
        .json("Invalid name, please enter a name between 3 and 255 characters");
    }

    if (!lastname || lastname.length < 3 || lastname.length > 255) {
      return res
        .status(400)
        .json(
          "The last name provided is invalid, it must contain between 3 and 255 characters",
        );
    }

    const { data: UserEmail } = await supabase
      .from("student")
      .select("id")
      .eq("email", email)
      .eq("created_by", created_by)
      .single();

    if (UserEmail) {
      return res.status(400).json({
        erro: "This email address is already associated with one of your students.",
      });
    }

    if (age && !Number.isInteger(age)) {
      return res.status(400).json("Age must be an integer");
    }
    if (weight && isNaN(weight)) {
      return res.status(400).json("Weight must be a numeric value");
    }
    if (height && isNaN(height)) {
      return res.status(400).json("Height must be a numeric value");
    }

    const { data: newstudent, error: errorInsercao } = await supabase
      .from("student")
      .insert([
        {
          name,
          lastname,
          email,
          age,
          weight,
          height,
          created_by,
        },
      ])
      .select("name, lastname, email, age, weight, height");

    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(201).json(newstudent);
  }
  async update(req, res) {
    const { id } = req.params;
    const created_by = req.userId;
    const { name, email, lastname, age, weight, height } = req.body;
    const updates = {};

    if (name && (name.length < 3 || name.length > 255)) {
      return res.status(400).json({
        erro: "Invalid name,please enter a name between 3 and 255 caracters",
      });
    } else if (name) {
      updates.name = name;
    }

    if (email) {
      if (!validator.isEmail(email)) {
        return res
          .status(400)
          .json({ erro: "The email address provided is either invalid" });
      }
      const { data: UserEmail, erro: erroEmail } = await supabase
        .from("student")
        .select("id")
        .eq("email", email)
        .single();

      if (UserEmail && UserEmail.id !== id) {
        return res.status(400).json({
          erro: "This email address is already associated with an existing account.",
        });
      }

      updates.email = email;
    }
    if (lastname && (lastname.length < 3 || lastname.length > 255)) {
      return res
        .status(400)
        .json(
          "The last name provided is invalid,it must contain between 3 and 255 caracters",
        );
    } else if (lastname) {
      updates.lastname = lastname;
    }
    if (age && !Number.isInteger(age)) {
      return res.status(400).json("Age must be an integer");
    } else if (age) {
      updates.age = age;
    }
    if (weight && isNaN(weight)) {
      return res.status(400).json("Weight must be a numeric value");
    } else if (weight) {
      updates.weight = weight;
    }
    if (height && isNaN(height)) {
      return res.status(400).json("Height must be a numeric value");
    } else if (height) {
      updates.height = height;
    }

    updates.updated_at = new Date().toISOString();
    const { data: newstudent, error: errorInsercao } = await supabase
      .from("student")
      .update(updates)
      .eq("id", Number(id))
      .eq("created_by", created_by)
      .select("name, lastname, email, age, weight, height");
    if (errorInsercao) {
      return res.status(400).json({ erro: errorInsercao.message });
    }
    return res.status(200).json(newstudent);
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
        .select("name, lastname, email, age, weight, height")
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
