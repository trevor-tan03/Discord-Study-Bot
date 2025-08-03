import { db } from "../database/database.js";

export async function createDeck(name: string, description: string | null) {
	const result = await db
		.insertInto("decks")
		.values({
			name,
			description,
		})
		.executeTakeFirst();

	return result.insertId;
}

export async function listDecks() {
	// Return the list of decks and their sizes
	const decks = await db
		.selectFrom("decks")
		.leftJoin("flashcards", "flashcards.deck_id", "decks.id")
		.select([
			"decks.name",
			"decks.description",
			db.fn.count("flashcards.id").as("flashcard_count"),
		])
		.groupBy("decks.id")
		.execute();
	return decks;
}

export async function getFlashcardsInDeck(deckName: string) {
	const flashcards = await db
		.selectFrom("decks")
		.innerJoin("flashcards", "flashcards.deck_id", "decks.id")
		// The id will be used for updating card after it's been reviewed
		.select(["flashcards.id", "flashcards.front", "flashcards.back"])
		.where("decks.name", "=", deckName)
		.execute();

	return flashcards;
}

export async function getFlashcardsWithTag(tags: string[]) {
	//
}

export async function deleteDeck(deckName: string) {
	const result = await db
		.deleteFrom("decks")
		.where("decks.name", "=", deckName)
		.executeTakeFirst();

	return result.numDeletedRows;
}

export async function deckExists(deckName: string) {
	const result = await db
		.selectFrom("decks")
		.select(db.fn.count("decks.id").as("deck_count"))
		.where("decks.name", "=", deckName)
		.executeTakeFirst();

	return result?.deck_count;
}
