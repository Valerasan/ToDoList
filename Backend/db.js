// db.js
import pg from "pg";
import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
  },
});

export default db;