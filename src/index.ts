import "./api.js";

import {
	Client,
	GatewayIntentBits
} from "discord.js";

import {
	handleInteraction
} from "./handlers/interactionHandler.js";

import {
	registerCommands
} from "./handlers/registerCommands.js";


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});


client.once(
	"clientReady",
	async () => {

		console.log(
			`Logged in as ${client.user.tag}`
		);

		await registerCommands(
			client.user.id
		);

		console.log(
			"Slash commands registered"
		);
	}
);


client.on(
	"interactionCreate",
	handleInteraction
);


client.login(
	process.env.DISCORD_TOKEN
);
