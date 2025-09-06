import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isRender = process.env.DATABASE_URL?.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRender ? { rejectUnauthorized: false } : false,
});

console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

export default pool;
