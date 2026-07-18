import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import {
	sendRobloxCommand
} from "../utils/bridge.js";


export default {

	data: new SlashCommandBuilder()

		.setName("topcoins")
		.setDescription("Shows the top 10 players with the most earned coins"),



	async execute(interaction: any) {

		await interaction.deferReply();


		try {

			const response =
				await sendRobloxCommand(
					"topcoins",
					{
						requester: interaction.user.id
					}
				);



			const result =
				await response.json();



			if (!result || !result.leaderboard) {

				await interaction.editReply({
					content:
						"❌ Failed to retrieve coin leaderboard."
				});

				return;
			}



			const leaderboard =
				result.leaderboard;



			const medals = [
				"🥇",
				🥈",
				"🥉"
			];



			const description =
				leaderboard
					.map(
						(player: any, index: number) => {

							const rank =
								index < 3
									? medals[index]
									: `#${index + 1}.`;



							return `${rank} **${player.username}**
${player.coins.toLocaleString()} 🪙`;

						}
					)
					.join("\n\n");



			const embed =
				new EmbedBuilder()

					.setTitle(
						"🏆 Top 10 Earned Coins"
					)

					.setDescription(
						description
					)

					.setColor(
						0xF1C40F
					)

					.setTimestamp();



			if (result.topPlayerImage) {

				embed.setImage(
					result.topPlayerImage
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
				"[TopCoins]",
				error
			);


			await interaction.editReply({

				content:
					"❌ Something went wrong while fetching the leaderboard."

			});

		}

	}

};
