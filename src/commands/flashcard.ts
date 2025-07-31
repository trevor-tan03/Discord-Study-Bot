import {
	ActionRowBuilder,
	CommandInteraction,
	ModalBuilder,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("flashcard")
	.setDescription("Manage flashcards")
	.addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
		subcommand.setName("make").setDescription("Create a new flashcard.")
	);

export async function execute(interaction: CommandInteraction) {
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

	await interaction.showModal(modal);
}
