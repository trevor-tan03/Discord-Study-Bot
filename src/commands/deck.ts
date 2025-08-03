import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
	createDeck,
	deckExists,
	deleteDeck,
	listDecks,
} from "../repositories/deckRepository.js";

type CreateDeckError = {
	reason: "invalidDeckName" | "duplicateDeckName";
};

type DeleteDeckError = {
	reason: "invalidDeckName" | "deckDoesNotExist" | "failedToDelete";
};

export const data = new SlashCommandBuilder()
	.setName("deck")
	.setDescription("Manage decks")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("create")
			.setDescription("Create a new deck.")
			.addStringOption((option) =>
				option
					.setName("deckname")
					.setDescription("Create a new deck to store flashcards")
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("description")
					.setDescription("Description of what to expect in the deck")
					.setRequired(false)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("delete")
			.setDescription("Delete a deck.")
			.addStringOption((option) =>
				option
					.setName("deckname")
					.setDescription(
						"Delete a deck and all associated flashcards"
					)
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("list")
			.setDescription(
				"List all decks and how many flashcards they contain."
			)
	);

async function handleCreateDeckRequest(
	interaction: ChatInputCommandInteraction,
	deckName: string | null,
	deckDescription: string | null
) {
	try {
		if (!deckName) {
			throw { reason: "invalidDeckName" } satisfies CreateDeckError;
		} else if (await deckExists(deckName)) {
			throw {
				reason: "duplicateDeckName",
			} satisfies CreateDeckError;
		}

		const createdDeckId = await createDeck(deckName, deckDescription);
		await interaction.reply({
			content: `Successfully created deck: ${deckName} (${createdDeckId})`,
			ephemeral: true,
		});
	} catch (error) {
		let errorMessage = "";
		if (typeof error === "object" && error !== null && "reason" in error) {
			const thrownObject = error as CreateDeckError;

			switch (thrownObject.reason) {
				case "invalidDeckName":
					errorMessage = "Invalid deck name";
					break;
				case "duplicateDeckName":
					errorMessage = "Deck name is already taken";
					break;
				default:
					throw `Unexpected unreachable case found: ${error.reason}`;
			}
		}

		throw { message: errorMessage };
	}
}

async function handleDeleteDeckRequest(
	interaction: ChatInputCommandInteraction,
	deckName: string | null
) {
	try {
		if (!deckName) {
			throw { reason: "invalidDeckName" } satisfies DeleteDeckError;
		} else if (!(await deckExists(deckName))) {
			throw {
				reason: "deckDoesNotExist",
			} satisfies DeleteDeckError;
		}

		const rowsDeleted = await deleteDeck(deckName);
		if (rowsDeleted)
			await interaction.reply({
				content: `Successfully deleted deck: ${deckName}`,
				ephemeral: true,
			});
		else throw { reason: "failedToDelete" } satisfies DeleteDeckError;
	} catch (error) {
		if (typeof error === "object" && error !== null && "reason" in error) {
			const thrownObject = error as CreateDeckError;

			switch (thrownObject.reason) {
				case "invalidDeckName":
					await interaction.reply({
						content: "Missing deck name",
						ephemeral: true,
					});
					break;
				case "duplicateDeckName":
					await interaction.reply({
						content: "Deck name is already taken",
						ephemeral: true,
					});
					break;
				default:
					throw `Unexpected unreachable case found: ${error.reason}`;
			}
		}

		throw error;
	}
}

export async function execute(interaction: ChatInputCommandInteraction) {
	const subcommand = interaction.options.getSubcommand();
	const deckName = interaction.options.getString("deckname");
	const deckDescription = interaction.options.getString("description");

	switch (subcommand) {
		case "create":
			await handleCreateDeckRequest(
				interaction,
				deckName,
				deckDescription
			);
			break;
		case "delete":
			await handleDeleteDeckRequest(interaction, deckName);
			break;
		case "list":
			const decks = await listDecks();
			await interaction.reply({
				content:
					decks.length > 0
						? decks
								.map(
									(deck) =>
										`- ${deck.name} (${deck.flashcard_count})`
								)
								.join("\n")
						: "No decks found.",
			});
			break;
		default:
			await interaction.reply({
				content: "Invalid subcommand",
				ephemeral: true,
			});
			break;
	}
}
