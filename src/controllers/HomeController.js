import supabase from "../../config/database.js";
class HomeC {
  async index(req, res) {
    const { data: novoaluno, error: errorInserção } = await supabase
      .from("alunos")
      .insert({
        name: "marcos",
        lastname: "alexandre",
        email: "marcosalexandrejlc@gmail.com",
        age: 16,
        weight: 53.3,
        height: 169,
      })
      .select("*");
    if (errorInserção) {
      return res.status(400).json({ erro: errorInserção.message });
    }
    return res.status(201).json(novoaluno);
  }
}

export default new HomeC();
