import Database from "better-sqlite3";
import { SqliteDialect } from "kysely";
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";

export default defineConfig({
	dialect: new SqliteDialect({
		database: new Database("db.sqlite"),
	}),
	destroyOnExit: true,
	migrations: {
		migrationFolder: "migrations",
		getMigrationPrefix: getKnexTimestampPrefix,
	},
	seeds: {
		seedFolder: "seeds",
	},
});
