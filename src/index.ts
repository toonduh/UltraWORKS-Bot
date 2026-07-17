import "./api.js";

import {
	Client,
	GatewayIntentBits,
	REST,
	Routes,
	SlashCommandBuilder,
	ChatInputCommandInteraction
} from "discord.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});

const commands = [
	new SlashCommandBuilder()
		.setName("about")
		.setDescription("Shows information about UltraWORKS Bot"),

	new SlashCommandBuilder()
		.setName("appointmap")
		.setDescription("Appoints a Roblox map")
		.addStringOption(option =>
			option
				.setName("map")
				.setDescription("Map name")
				.setRequired(true)
		)
].map(command => command.toJSON());


async function sendRobloxCommand(type: string, data: object) {
	const bridgeUrl = process.env.BRIDGE_URL;
	const bridgeKey = process.env.BRIDGE_KEY;

	if (!bridgeUrl || !bridgeKey) {
		throw new Error("Missing BRIDGE_URL or BRIDGE_KEY");
	}

	console.log("Sending Roblox command:", { type, data });

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);

	try {
		const response = await fetch(`${bridgeUrl}/command`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": bridgeKey
			},
			body: JSON.stringify({
				type,
				data
			}),
			signal: controller.signal
		});

		console.log("Bridge response:", response.status);

		return response;
	} finally {
		clearTimeout(timeout);
	}
}


client.once("ready", async () => {
	console.log(`Logged in as ${client.user?.tag}`);

	const rest = new REST({
		version: "10"
	}).setToken(process.env.DISCORD_TOKEN!);

	await rest.put(
		Routes.applicationCommands(client.user!.id),
		{
			body: commands
		}
	);

	console.log("Slash commands registered");
});


client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	try {
		if (interaction.commandName === "about") {
			await interaction.reply({
				content:
					"UltraWORKS Bot bridges Discord commands with Roblox games."
			});
		}

		if (interaction.commandName === "appointmap") {
			await interaction.deferReply();

			const map = interaction.options.getString("map", true);

			await sendRobloxCommand("appointmap", {
				map
			});

			await interaction.editReply(
				`Appointed Roblox map: ${map}`
			);
		}
	} catch (error) {
		console.error(error);

		if (interaction.deferred) {
			await interaction.editReply("Command failed.");
		} else {
			await interaction.reply("Command failed.");
		}
	}
});


client.login(process.env.DISCORD_TOKEN);
