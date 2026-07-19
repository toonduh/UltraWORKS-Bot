import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import {
	sendRobloxQuery
} from "../utils/bridge.js";

import {
	getRobloxHeadshot,
	getRobloxUserId
} from "../utils/roblox.js";


export default {

	data: new SlashCommandBuilder()

		.setName("find")

		.setDescription(
			"Finds a player currently in-game."
		)

		.addStringOption(option =>
			option

				.setName("user")

				.setDescription(
					"Username or UserId"
				)

				.setRequired(true)
		),



	async execute(interaction: any) {

		await interaction.deferReply();



		const input =
			interaction.options.getString(
				"user",
				true
			);



		let userId: number;



		if (/^\d+$/.test(input)) {

			userId =
				Number(input);

		}

		else {

			userId =
				await getRobloxUserId(input);


			if (!userId) {

				await interaction.editReply(
					"❌ Roblox user not found."
				);

				return;

			}

		}



		try {

			const result =
				await sendRobloxQuery(
					"find",
					{
						userId
					}
				);



			if (
				!result ||
				!result.found
			) {

				await interaction.editReply(
					"❌ That player is not currently in-game."
				);

				return;

			}



			const avatar =
				await getRobloxHeadshot(
					userId.toString()
				);



			const embed =
				new EmbedBuilder()

					.setColor(
						0x00A2FF
					)

					.setTitle(
						"🔎 Player Found"
					)

					.addFields(

						{
							name: "Username",
							value:
								result.username ??
								"Unknown",
							inline: true
						},

						{
							name: "User ID",
							value:
								userId.toString(),
							inline: true
						},

						{
							name: "Device",
							value:
								result.device ??
								"Unknown",
							inline: true
						},

						{
							name: "Server",
							value:
								result.serverId ??
								"Unknown",
							inline: false
						},

						{
							name: "Join",
							value:
								result.joinLink
									? `[Join Game](${result.joinLink})`
									: "Unavailable",
							inline: false
						}

					)

					.setTimestamp();



			if (avatar) {

				embed.setThumbnail(
					avatar
				);

			}



			await interaction.editReply({

				embeds: [
					embed
				]

			});


		}

		catch(error) {

			console.error(
				"[Find Error]",
				error
			);



			await interaction.editReply({

				content:
					`❌ Error: ${
						error instanceof Error
							? error.message
							: String(error)
					}`

			});

		}

	}

};
