import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface Database {
	decks: DeckTable;
	tags: TagTable;
	flashcards: FlashcardTable;
	flashcard_tags: FlashCardTagTable;
}

export interface DeckTable {
	id: Generated<number>;
	name: string;
	description: string | null;
	created_at: ColumnType<Date, string | undefined, never>;
}

export type Deck = Selectable<DeckTable>;
export type NewDeck = Insertable<DeckTable>;
export type DeckUpdate = Updateable<DeckTable>;

export interface TagTable {
	id: Generated<number>;
	name: string;
}

export type Tag = Selectable<TagTable>;
export type NewTag = Insertable<TagTable>;
export type TagUpdate = Updateable<TagTable>;

export interface FlashcardTable {
	id: Generated<number>;
	deck_id: number;
	front: string;
	back: string;

	// due_date: string;
	// ease_factor: number;
	// interval: number;
	// repetitions: number;
}

export type Flashcard = Selectable<FlashcardTable>;
export type NewFlashcard = Insertable<FlashcardTable>;
export type FlashcardUpdate = Updateable<FlashcardTable>;

export interface FlashCardTagTable {
	id: Generated<number>;
	flashcard_id: number;
	tag_id: number;
}

export type FlashcardTag = Selectable<FlashCardTagTable>;
export type NewFlashcardTag = Insertable<FlashCardTagTable>;
export type FlashcardTagUpdate = Updateable<FlashCardTagTable>;
