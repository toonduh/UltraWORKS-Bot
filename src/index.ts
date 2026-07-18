import "./api.js";

import {
	Client,
	GatewayIntentBits,
	REST,
	Routes,
	SlashCommandBuilder,
	EmbedBuilder
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
		),

	new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban a Roblox player")
		.addStringOption(option =>
			option
				.setName("userid")
				.setDescription("Roblox User ID")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("reason")
				.setDescription("Ban reason")
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option
				.setName("duration")
				.setDescription("Ban duration in seconds (-1 = permanent)")
				.setRequired(true)
		)

].map(x => x.toJSON());



async function sendRobloxCommand(type:string,data:any){

	const response = await fetch(
		`${process.env.BRIDGE_URL}/command`,
		{
			method:"POST",
			headers:{
				"Content-Type":"application/json",
				"Authorization":process.env.BRIDGE_KEY!
			},
			body:JSON.stringify({
				type,
				data
			})
		}
	);

	console.log(
		"Bridge response:",
		response.status
	);

	return response;
}



async function getRobloxHeadshot(userId:string){

	const response = await fetch(
		`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png`
	);

	const data:any = await response.json();

	return data.data?.[0]?.imageUrl;
}



client.once("ready", async()=>{

	console.log(
		`Logged in as ${client.user?.tag}`
	);


	const rest = new REST({
		version:"10"
	}).setToken(
		process.env.DISCORD_TOKEN!
	);


	await rest.put(
		Routes.applicationCommands(
			client.user!.id
		),
		{
			body:commands
		}
	);


	console.log("Slash commands registered");

});



client.on(
"interactionCreate",
async interaction=>{

	if(!interaction.isChatInputCommand())
		return;


	try {


		if(interaction.commandName==="ban"){

			await interaction.deferReply({
				ephemeral:true
			});


			const userId =
				interaction.options.getString("userid",true);

			const reason =
				interaction.options.getString("reason",true);

			const duration =
				interaction.options.getInteger("duration",true);



			console.log(
				"Sending ban command",
				{
					userId,
					reason,
					duration
				}
			);



			await sendRobloxCommand(
				"ban",
				{
					userId,
					reason,
					duration,
					moderator:
						interaction.user.id
				}
			);



			const avatar =
				await getRobloxHeadshot(userId);



			const embed = new EmbedBuilder()
				.setTitle(
					"🚨 Player Banned"
				)
				.setDescription(
					`A player has been banned from the game.`
				)
				.addFields(

					{
						name:"User ID",
						value:userId
					},

					{
						name:"Reason",
						value:reason
					},

					{
						name:"Duration",
						value:
						duration === -1
						? "Permanent"
						: `${duration}s`
					},

					{
						name:"Moderator",
						value:
						`<@${interaction.user.id}>`
					}

				)
				.setTimestamp();



			if(avatar)
				embed.setThumbnail(avatar);



			await interaction.editReply({
				content:"Ban sent to Roblox.",
				embeds:[
					embed
				]
			});


		}



		if(interaction.commandName==="appointmap"){

			await interaction.deferReply();

			const map =
				interaction.options.getString(
					"map",
					true
				);


			await sendRobloxCommand(
				"appointmap",
				{
					map
				}
			);


			await interaction.editReply(
				`Appointed Roblox map: ${map}`
			);

		}



	}
	catch(err){

		console.error(err);

		if(interaction.deferred)
			await interaction.editReply(
				"Command failed."
			);

	}

});


client.login(
	process.env.DISCORD_TOKEN
);
