import postgres from "postgres";

declare global {
  var __fitnessSql: postgres.Sql | undefined;
}

const connectionString = process.env.DATABASE_URL;

const missingDatabase = (() => {
  const fail = () => {
    throw new Error("DATABASE_URL is not configured.");
  };

  const tagged = ((...args: unknown[]) => {
    void args;
    fail();
  }) as unknown as postgres.Sql;
  (tagged as unknown as { begin: () => never }).begin = () => fail();
  return tagged;
})();

export const sql = connectionString
  ? global.__fitnessSql ??
    postgres(connectionString, {
      prepare: false,
      ssl: "require",
    })
  : missingDatabase;

if (process.env.NODE_ENV !== "production") {
  global.__fitnessSql = sql;
}
