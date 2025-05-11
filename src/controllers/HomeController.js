import supabase from "../../config/database.js";
class HomeC {
  async index(req, res) {
    const { data: novoaluno, error: errorInserção } = await supabase
      .from("alunos")
      .insert({
        nome: "marcos",
        sobrenome: "alexandre",
        email: "marcosalexandrejlc@gmail.com",
        idade: 16,
        peso: 53.3,
        altura: 169,
      })
      .select("*");
    if (errorInserção) {
      return res.status(400).json({ erro: errorInserção.message });
    }
    return res.status(201).json(novoaluno);
  }
}

export default new HomeC();
