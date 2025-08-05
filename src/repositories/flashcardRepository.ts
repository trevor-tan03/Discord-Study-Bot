import { db } from "../database/database.js";

export async function createFlashcard(
	front: string,
	back: string,
	deckName: string,
	tagName?: string
) {
	return await db.transaction().execute(async (trx) => {
		// Get or create deck
		let deck = await trx
			.selectFrom("decks")
			.select("id")
			.where("name", "=", deckName)
			.executeTakeFirst();

		if (!deck) {
			deck = await trx
				.insertInto("decks")
				.values({ name: deckName })
				.returning("id")
				.executeTakeFirstOrThrow();
		}

		// Create flashcard
		const { id: flashcardId } = await trx
			.insertInto("flashcards")
			.values({ deck_id: deck.id, front, back })
			.returning("id")
			.executeTakeFirstOrThrow();

		// Handle tag if provided
		if (tagName) {
			let tag = await trx
				.selectFrom("tags")
				.select("id")
				.where("name", "=", tagName)
				.executeTakeFirst();

			if (!tag) {
				tag = await trx
					.insertInto("tags")
					.values({ name: tagName })
					.returning("id")
					.executeTakeFirstOrThrow();
			}

			// Check if tag relationship already exists
			const existingRelation = await trx
				.selectFrom("flashcard_tags")
				.select("flashcard_id")
				.where("flashcard_id", "=", flashcardId)
				.where("tag_id", "=", tag.id)
				.executeTakeFirst();

			if (!existingRelation) {
				await trx
					.insertInto("flashcard_tags")
					.values({ flashcard_id: flashcardId, tag_id: tag.id })
					.executeTakeFirst();
			}
		}

		return flashcardId;
	});
}
