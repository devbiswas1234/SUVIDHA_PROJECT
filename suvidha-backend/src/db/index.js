import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function dbHealthCheck() {
  const res = await pool.query("SELECT NOW()");
  return res.rows[0];
}
