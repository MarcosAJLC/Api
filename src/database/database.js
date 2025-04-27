import dotenv from "dotenv";
dotenv.config();
import { readFileSync } from "fs";
import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.BancoDados,
  ssl: { rejectUnauthorized: false },
});

async function runSQL() {
  const sql = readFileSync("./src/database/banco.sql", "utf8");
  await client.connect();
  await client.query(sql);
  await client.end();
}

runSQL();
