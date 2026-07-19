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

		if (!client.user)
			return;


		console.log(
			`Logged in as ${client.user.tag}`
		);


		try {

			await registerCommands(
				client.user.id
			);


			console.log(
				"Slash commands registered"
			);

		}
		catch(error){

			console.error(
				"Failed registering commands:",
				error
			);

		}

	}

);


client.on(
	"interactionCreate",
	async interaction => {

		try {

			await handleInteraction(
				interaction
			);

		}
		catch(error){

			console.error(
				"Interaction error:",
				error
			);

		}

	}

);


client.login(
	process.env.DISCORD_TOKEN
)
.catch(error => {

	console.error(
		"Discord login failed:",
		error
	);

});
