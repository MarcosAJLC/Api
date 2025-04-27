import supabase from "../../config/database.js";

class UserC {
  async store(req, res) {
    const { data: novoUser, error: errorInserção } = await supabase
      .from("users")
      .insert({
        nome: "Marcos",
        email: "marcosalexandrejlc@gmail.com",
        password_hash: "emigam2008",
      })
      .select("*");
    if (errorInserção) {
      return res.status(400).json({ erro: errorInserção.message });
    }
    return res.status(201).json(novoUser);
  }
}

export default new UserC();
