import {
	ActionRowBuilder,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	ModalBuilder,
	ModalSubmitInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { listDecks } from "../repositories/deckRepository.js";
import { createFlashcard } from "../repositories/flashcardRepository.js";
import { listTags } from "../repositories/tagRepository.js";

type CreateFlashcardError = {
	reason: "missingDeckName" | "invalidDeckName";
};

export const data = new SlashCommandBuilder()
	.setName("flashcard")
	.setDescription("Manage flashcards")
	.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
		subcommand
			.setName("create")
			.setDescription("Create a new flashcard.")
			.addStringOption((option) =>
				option
					.setName("deckname")
					.setDescription("Deck the flashcard will be created under")
					.setAutocomplete(true)
					.setRequired(true)
			)
			.addStringOption((option) =>
				option
					.setName("tagname")
					.setDescription("Tag associated with the flashcard")
					.setAutocomplete(true)
					.setRequired(false)
			)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const subcommand = interaction.options.getSubcommand();
	const deckName = interaction.options.getString("deckname");
	const tagName = interaction.options.getString("tagname");

	switch (subcommand) {
		case "create":
			if (!deckName)
				throw {
					reason: "invalidDeckName",
				} satisfies CreateFlashcardError;
			const modal = buildCreateFlashcardModal(deckName, tagName);
			await interaction.showModal(modal);
	}
}

export async function handleCreateFlashcard(
	interaction: ModalSubmitInteraction
) {
	// Expect requried "deckname" argument with optional "tagname" argument
	const commandArguments = interaction.customId.split("_").slice(1);
	if (commandArguments.length < 1)
		throw { reason: "missingDeckName" } satisfies CreateFlashcardError;

	const deckName = commandArguments[0]!;
	const tagName =
		commandArguments.length === 2 ? commandArguments[1] : undefined;
	const front = interaction.fields.getTextInputValue("front");
	const back = interaction.fields.getTextInputValue("back");

	const newFlashcardId = await createFlashcard(
		front,
		back,
		deckName,
		tagName
	);

	await interaction.reply({
		content: `Created new flashcard (${newFlashcardId}) in ${deckName}`,
		ephemeral: true,
	});
}

function buildCreateFlashcardModal(deckName: string, tagName: string | null) {
	const modalId = `flashcard_${deckName}${tagName ? `_${tagName}` : ""}`;
	const modal = new ModalBuilder()
		.setCustomId(modalId)
		.setTitle(`Create flashcard in deck: ${deckName}`);

	const frontInput = new TextInputBuilder()
		.setCustomId("front")
		.setLabel("Front")
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder("Enter the front of the flashcard")
		.setRequired(true);

	const backInput = new TextInputBuilder()
		.setCustomId("back")
		.setLabel("Back")
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder("Enter the back of the flashcard")
		.setRequired(true);

	modal.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(frontInput),
		new ActionRowBuilder<TextInputBuilder>().addComponents(backInput)
	);

	return modal;
}

export async function autocomplete(interaction: AutocompleteInteraction) {
	const focusedOption = interaction.options.getFocused(true);
	let choices: string[] = [];

	if (focusedOption.name === "deckname") {
		choices = (await listDecks()).map((deck) => deck.name);
	} else if (focusedOption.name === "tag") {
		choices = (await listTags()).map((tag) => tag.name);
	}

	const filtered = choices?.filter((choice) =>
		choice.startsWith(focusedOption.value)
	);
	await interaction.respond(
		filtered?.map((choice) => ({ name: choice, value: choice }))
	);
}
