import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import { sendRobloxCommand } from "../utils/bridge.js";

export default {

	data: new SlashCommandBuilder()

		.setName("restart")
		.setDescription("Restarts every Running Lurking Giants server.")

		.addIntegerOption(option =>
			option
				.setName("countdown")
				.setDescription("Seconds until restart (default: 60)")
				.setRequired(false)
		)

		.addStringOption(option =>
			option
				.setName("reason")
				.setDescription("Reason for the restart")
				.setRequired(false)
		)

		.addBooleanOption(option =>
			option
				.setName("announce")
				.setDescription("Broadcast the restart to players")
				.setRequired(false)
		),

	async execute(interaction: any) {

		await interaction.deferReply();

		const countdown =
			interaction.options.getInteger("countdown") ?? 60;

		const reason =
			interaction.options.getString("reason") ??
			"Server Update";

		const announce =
			interaction.options.getBoolean("announce") ?? true;

		await sendRobloxCommand(
			"restart",
			{
				countdown,
				reason,
				announce,
				moderator: interaction.user.id
			}
		);

		const embed = new EmbedBuilder()

			.setColor(0xF39C12)

			.setTitle("Server Restart Scheduled")

			.setDescription(
				"All Roblox servers have been instructed to restart."
			)

			.addFields(
				{
					name: "Countdown",
					value: `${countdown} seconds`,
					inline: true
				},
				{
					name: "Announce",
					value: announce ? "Yes" : "No",
					inline: true
				},
				{
					name: "Moderator",
					value: `<@${interaction.user.id}>`,
					inline: true
				},
				{
					name: "Reason",
					value: reason,
					inline: false
				}
			)

			.setTimestamp();

		await interaction.editReply({
			embeds: [embed]
		});
	}
};
