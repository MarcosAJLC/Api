class HomeC {
  index(req, res) {
    res.json({
      TudoCerto: true,
    });
  }
}

export default new HomeC();
