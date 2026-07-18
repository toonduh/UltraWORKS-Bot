import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import { sendRobloxCommand } from "../utils/bridge.js";
import {
	getRobloxHeadshot,
	getRobloxUserId
} from "../utils/roblox.js";

export default {

	data: new SlashCommandBuilder()
		.setName("find")
		.setDescription("Finds a player currently in-game.")
		.addStringOption(option =>
			option
				.setName("user")
				.setDescription("Username or UserId")
				.setRequired(true)
		),

	async execute(interaction: any) {

		await interaction.deferReply();

		const input = interaction.options.getString("user", true);

		let userId: number;

		if (/^\d+$/.test(input)) {
			userId = Number(input);
		} else {
			userId = await getRobloxUserId(input);

			if (!userId) {
				return interaction.editReply("❌ Roblox user not found.");
			}
		}

		const response = await sendRobloxCommand("find", {
			userId
		});

		const result = await response.json();

		if (!result.found) {
			return interaction.editReply("❌ That player is not currently in-game.");
		}

		const avatar = await getRobloxHeadshot(userId.toString());

		const embed = new EmbedBuilder()
			.setColor(0x00A2FF)
			.setTitle("🔎 Player Found")
			.setThumbnail(avatar)
			.addFields(
				{
					name: "Username",
					value: result.username,
					inline: true
				},
				{
					name: "User ID",
					value: userId.toString(),
					inline: true
				},
				{
					name: "Device",
					value: result.device,
					inline: true
				},
				{
					name: "Server",
					value: result.serverId,
					inline: false
				},
				{
					name: "Join",
					value: `[Join Game](${result.joinLink})`,
					inline: false
				}
			)
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed]
		});
	}
};
