import { REST, Routes, type Client } from "discord.js";
import "dotenv/config";

export async function deployCommands(client: Client, commands: any[]) {
	const token = process.env.DISCORD_TOKEN;
	const clientId = process.env.CLIENT_ID;
	const guildId = process.env.GUILD_ID;

	if (!token || !clientId || !guildId)
		throw new Error(
			"Must have DISCORD_TOKEN, CLIENT_ID, and GUILD_ID environment variables"
		);

	try {
		const rest = new REST().setToken(token);
		console.log(
			`Started refreshing ${client.commands.size} application (/) commands.`
		);

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});

		console.log(
			`Successfully reloaded ${commands.length} application (/) commands.`
		);
	} catch (error) {
		throw new Error((error as Error).message);
	}
}
