// src/types/discord.d.ts
import { Collection } from "discord.js";

// Define the structure of your Command
interface Command {
	data: any; // You'll typically define a more specific type for command data (e.g., SlashCommandBuilder)
	execute: (interaction: any) => Promise<void>; // You'll type interaction more specifically later
	// Add any other properties your commands might have, e.g., cooldowns, categories
	cooldown?: number;
}

declare module "discord.js" {
	export interface Client {
		commands: Collection<string, Command>;
	}
}
