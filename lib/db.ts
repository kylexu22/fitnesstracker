import postgres from "postgres";

declare global {
  var __fitnessSql: postgres.Sql | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

export const sql =
  global.__fitnessSql ??
  postgres(connectionString, {
    prepare: false,
    ssl: "require",
  });

if (process.env.NODE_ENV !== "production") {
  global.__fitnessSql = sql;
}
