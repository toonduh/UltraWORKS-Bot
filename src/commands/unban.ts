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

			.setName("unban")

			.setDescription(
				"Unban a Roblox player"
			)

			.addStringOption(o =>
				o.setName("userid")
				.setDescription("Roblox User ID")
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



		await sendRobloxCommand(
			"unban",
			{
				userId,

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
				"Player Unbanned"
			)

			.addFields(
				{
					name:"User ID",
					value:userId
				},
				{
					name:"Moderator",
					value:
						`<@${interaction.user.id}>`
				}
			)

			.setColor(
				0x2ECC71
			)

			.setTimestamp();



		if(avatar)
			embed.setThumbnail(
				avatar
			);



		await interaction.editReply({

			content:
				"Unban sent to Roblox.",

			embeds:[
				embed
			]

		});

	}

};
