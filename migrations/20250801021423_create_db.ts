import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("decks")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("name", "text", (col) => col.notNull().unique())
		.addColumn("description", "text")
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.execute();

	await db.schema
		.createTable("tags")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("name", "text", (col) => col.notNull().unique())
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.execute();

	await db.schema
		.createTable("flashcards")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("front", "text", (col) => col.notNull())
		.addColumn("back", "text", (col) => col.notNull())
		.addColumn("deck_id", "integer", (col) =>
			col.notNull().references("decks.id")
		)
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
		)
		.execute();

	await db.schema
		.createTable("flashcard_tags")
		.addColumn("flashcard_id", "integer", (col) =>
			col.notNull().references("flashcards.id")
		)
		.addColumn("tag_id", "integer", (col) =>
			col.notNull().references("tags.id")
		)
		.addPrimaryKeyConstraint("card_tags_pk", ["flashcard_id", "tag_id"])
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("flashcard_tags").execute();
	await db.schema.dropTable("flashcards").execute();
	await db.schema.dropTable("tags").execute();
	await db.schema.dropTable("decks").execute();
}
