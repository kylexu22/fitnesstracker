import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is required to run migrations.");
  process.exit(1);
}

const sql = postgres(connectionString, {
  prepare: false,
  ssl: "require",
});

const schemaPath = path.resolve(process.cwd(), "db/schema.sql");

try {
  const schemaSql = await readFile(schemaPath, "utf8");
  await sql.unsafe(schemaSql);
  console.log("Migration complete.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
