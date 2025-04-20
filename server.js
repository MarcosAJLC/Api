import app from "./app.js";

const port = 3001;
app.listen(port, () => {
  console.log();
  console.log(`web na porta ${port}`);
  console.log(`web em http://localhost:${port}`);
});
