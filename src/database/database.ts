import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Database } from "./types.js";

const dialect = new SqliteDialect({
	database: new SQLite(":memory:"),
});

export const db = new Kysely<Database>({
	dialect,
});
