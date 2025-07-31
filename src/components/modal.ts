import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export function createModal() {
	const modal = new ModalBuilder()
		.setCustomId("flashcardModal")
		.setTitle("Create Flashcard");

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
