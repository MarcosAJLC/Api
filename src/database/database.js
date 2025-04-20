import { readFileSync } from "fs";
import { Client } from "pg";

const client = new Client({
  connectionString: "postgres://usuario:senha@host:porta/database",
  ssl: { rejectUnauthorized: false },
});

async function runSQL() {
  const sql = readFileSync("./database/banco.sql", "utf8");
  await client.connect();
  await client.query(sql);
  await client.end();
}

runSQL();
