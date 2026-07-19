import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import {
	sendRobloxCommand
} from "../utils/bridge.js";


export default {

	data:
		new SlashCommandBuilder()

			.setName("appointmap")

			.setDescription(
				"Appoints a map for all servers in the next round"
			)

			.addStringOption(option =>
				option

					.setName("map")

					.setDescription(
						"Map name"
					)

					.setRequired(true)
			),



	async execute(interaction: any) {

		await interaction.deferReply();



		const map =
			interaction.options.getString(
				"map",
				true
			);



		try {


			const result =
				await sendRobloxCommand(
					"appointmap",
					{
						map,
						moderator:
							interaction.user.id
					}
				);



			if (
				!result ||
				result.success !== true
			) {


				const failedEmbed =
					new EmbedBuilder()

						.setTitle(
							"❌ Map Appointment Failed"
						)

						.setDescription(
							result?.error
								?
								result.error
								:
								`Failed to appoint **${map}**.`
						)

						.setColor(
							0xE74C3C
						)

						.addFields({

							name:
								"Requested Map",

							value:
								map,

							inline:true

						})

						.setTimestamp();



				await interaction.editReply({

					embeds:[
						failedEmbed
					]

				});


				return;

			}



			const embed =
				new EmbedBuilder()

					.setTitle(
						"Map Appointed"
					)

					.setDescription(
						`The next round map has been set to **${result.map ?? map}**.`
					)

					.setColor(
						0x2ECC71
					)

					.addFields(

						{
							name:
								"Map",

							value:
								result.map ?? map,

							inline:true
						},

						{
							name:
								"Moderator",

							value:
								`<@${interaction.user.id}>`,

							inline:true
						}

					)

					.setTimestamp();



			if (
				result.image
			) {

				embed.setImage(
					result.image
				);

			}



			await interaction.editReply({

				embeds:[
					embed
				]

			});


		}
		catch(error) {


			console.error(
				"[AppointMap Error]",
				error
			);



			const errorEmbed =
				new EmbedBuilder()

					.setTitle(
						"❌ Bridge Error"
					)

					.setDescription(
						"Failed to communicate with Roblox."
					)

					.setColor(
						0xE74C3C
					)

					.setTimestamp();



			await interaction.editReply({

				embeds:[
					errorEmbed
				]

			});

		}

	}

};
