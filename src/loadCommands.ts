import { Client } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function loadCommands(client: Client) {
	const commands = [];

	try {
		const commandsPath = path.join(import.meta.dirname, "commands");
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".js")); // Checking from /dist

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const fileUrl = pathToFileURL(filePath).href;

			try {
				const command = await import(fileUrl);
				if ("data" in command && "execute" in command) {
					client.commands.set(command.data.name, command);
					commands.push(command.data.toJSON());
					console.log(`Loaded: ${file}`);
				}
			} catch (error) {
				console.error(`Failed to import or process ${file}:`, error);
			}
		}
	} catch (error) {
		throw new Error(`Failed to load commands: ${(error as Error).message}`);
	} finally {
		console.log(`Commands loaded: ${client.commands.size}`);
		return commands;
	}
}
