import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	MessageFlags,
} from "discord.js";
import "dotenv/config";
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
			const front = interaction.fields.getTextInputValue("front");
			const back = interaction.fields.getTextInputValue("back");

			await interaction.reply({
				content: `Flashcard created!\n**Front:** ${front}\n**Back:** ${back}`,
				ephemeral: true,
			});
		}
	} catch (error) {
		console.error(error);
		if (!interaction.isChatInputCommand()) return;
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

client.login(token);
client.commands = new Collection();
