import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import {
	sendRobloxCommand
} from "../utils/bridge.js";

import {
	getRobloxHeadshot
} from "../utils/roblox.js";


export default {

	data:
		new SlashCommandBuilder()
			.setName("ban")
			.setDescription(
				"Ban a Roblox player"
			)

			.addStringOption(o =>
				o.setName("userid")
				.setDescription("Roblox User ID")
				.setRequired(true)
			)

			.addStringOption(o =>
				o.setName("reason")
				.setDescription("Ban reason")
				.setRequired(true)
			)

			.addIntegerOption(o =>
				o.setName("duration")
				.setDescription("-1 = permanent")
				.setRequired(true)
			),


	async execute(interaction:any){

		await interaction.deferReply({
			ephemeral:true
		});


		const userId =
			interaction.options.getString(
				"userid",
				true
			);


		const reason =
			interaction.options.getString(
				"reason",
				true
			);


		const duration =
			interaction.options.getInteger(
				"duration",
				true
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
			await getRobloxHeadshot(
				userId
			);



		const embed =
			new EmbedBuilder()

			.setTitle(
				"🚨 Player Banned"
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
			embed.setThumbnail(
				avatar
			);



		await interaction.editReply({
			content:"Ban sent to Roblox.",
			embeds:[
				embed
			]
		});

	}

};
