import "./api.js";

import {
	Client,
	GatewayIntentBits,
	ActivityType
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


const statuses = [
	"Playing Lurking Giants",
	"Managing Roblox Servers",
	"Watching Lurking Giants Players",
	"Use /about to learn more!"
];


let statusIndex = 0;



client.once(
	"clientReady",
	async () => {

		if (!client.user)
			return;


		console.log(
			`Logged in as ${client.user.tag}`
		);



		// Set initial presence
		client.user.setPresence({

			status: "online",

			activities: [
				{
					name: statuses[0],
					type: ActivityType.Playing
				}
			]

		});



		// Rotate presence every 30 seconds
		setInterval(() => {

			if (!client.user)
				return;


			statusIndex++;


			if (statusIndex >= statuses.length)
				statusIndex = 0;



			client.user.setPresence({

				status: "online",

				activities: [
					{
						name: statuses[statusIndex],
						type: ActivityType.Playing
					}
				]

			});


		}, 30000);



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
