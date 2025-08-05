import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	MessageFlags,
} from "discord.js";
import "dotenv/config";
import { handleCreateFlashcard } from "./commands/flashcard.js";
import { deployCommands } from "./deployCommands.js";
import { loadCommands } from "./loadCommands.js";

const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (readyClient) => {
	const commands = await loadCommands(readyClient);
	await deployCommands(readyClient, commands);
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	try {
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			await command.execute(interaction);
		} else if (interaction.isModalSubmit()) {
			// Currently only using a modal for creating flashcard
			if (interaction.customId.startsWith("flashcard")) {
				await handleCreateFlashcard(interaction);
			} else {
				throw { reason: "Unable to handle unexpected modal" };
			}
		} else if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			await command.autocomplete(interaction);
		}
	} catch (error) {
		console.error(error);
		if (!interaction.isChatInputCommand()) return;
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: `There was an error while executing this command: **${
					(error as Error).message
				}**`,
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: `There was an error while executing this command: **${
					(error as Error).message
				}**`,
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

client.login(token);
client.commands = new Collection();
