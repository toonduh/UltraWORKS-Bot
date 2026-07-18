import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

const UNIVERSE_ID =
	Number(process.env.ROBLOX_UNIVERSE_ID ?? 2339944792);

export default {

	data: new SlashCommandBuilder()

		.setName("gamestats")

		.setDescription(
			"Shows live Roblox game statistics."
		),


	async execute(interaction: any) {

		await interaction.deferReply();


		try {

			// Game information
			const gameResponse =
				await fetch(
					`https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
				);

			const gameData: any =
				await gameResponse.json();

			const game =
				gameData.data?.[0];

			if (!game) {
				return interaction.editReply(
					"❌ Failed to fetch game information."
				);
			}


			// Game icon
			const iconResponse =
				await fetch(
					`https://thumbnails.roblox.com/v1/games/icons?universeIds=${UNIVERSE_ID}&size=512x512&format=Png&isCircular=false`
				);

			const iconData: any =
				await iconResponse.json();

			const icon =
				iconData.data?.[0]?.imageUrl;


			// Game thumbnail
			const thumbnailResponse =
				await fetch(
					`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${UNIVERSE_ID}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`
				);

			const thumbnailData: any =
				await thumbnailResponse.json();

			const thumbnail =
				thumbnailData.data?.[0]?.thumbnails?.[0]?.imageUrl;


			const embed =
				new EmbedBuilder()

					.setColor(
						0x5865F2
					)

					.setTitle(
						game.name
					)

					.setURL(
						`https://www.roblox.com/games/${game.rootPlaceId}`
					)

					.setDescription(
						"Current live Roblox game statistics."
					)

					.addFields(

						{
							name: "👥 Current Players",
							value: game.playing.toLocaleString(),
							inline: true
						},

						{
							name: "👁️ Visits",
							value: game.visits.toLocaleString(),
							inline: true
						},

						{
							name: "⭐ Favorites",
							value: game.favoritedCount.toLocaleString(),
							inline: true
						},

						{
							name: "👍 Likes",
							value: game.upVotes.toLocaleString(),
							inline: true
						},

						{
							name: "👎 Dislikes",
							value: game.downVotes.toLocaleString(),
							inline: true
						},

						{
							name: "📊 Rating",
							value:
								`${(
									(game.upVotes /
										Math.max(
											1,
											game.upVotes +
											game.downVotes
										)) * 100
								).toFixed(1)}%`,
							inline: true
						}

					)

					.setThumbnail(
						icon
					)

					.setImage(
						thumbnail
					)

					.setFooter({
						text: "UltraWORKS • Live Game Statistics"
					})

					.setTimestamp();


			await interaction.editReply({
				embeds: [
					embed
				]
			});

		}
		catch (err) {

			console.error(err);

			await interaction.editReply(
				"❌ Failed to fetch Roblox game statistics."
			);

		}

	}

};
