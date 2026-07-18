import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import {
	sendRobloxCommand
} from "../utils/bridge.js";


export default {

	data: new SlashCommandBuilder()

		.setName("clear")
		.setDescription("Clears a player's data from the past 90 days")

		.addStringOption(option =>
			option
				.setName("userid")
				.setDescription("Roblox User ID")
				.setRequired(true)
		),


	async execute(interaction: any) {

		await interaction.deferReply({
			ephemeral: true
		});


		const userId =
			interaction.options.getString(
				"userid",
				true
			);



		await sendRobloxCommand(
			"clear",
			{
				userId,
				days: 90,
				moderator: interaction.user.id
			}
		);



		const embed =
			new EmbedBuilder()

				.setTitle(
					"Data Clear Requested"
				)

				.setDescription(
					`Player data has been queued for deletion.`
				)

				.addFields(

					{
						name: "User ID",
						value: userId,
						inline: true
					},

					{
						name: "Period",
						value: "Last 90 days",
						inline: true
					},

					{
						name: "Moderator",
						value: `<@${interaction.user.id}>`,
						inline: true
					}

				)

				.setColor(
					0xE74C3C
				)

				.setTimestamp();



		await interaction.editReply({
			embeds: [
				embed
			]
		});

	}

};
