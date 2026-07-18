import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("gamestats")
		.setDescription("Shows live Roblox game statistics"),

	async execute(interaction: any) {
		await interaction.deferReply();

		const universeId = 2339944792;

		try {
			// Game info
			const gameRes = await fetch(
				`https://games.roblox.com/v1/games?universeIds=${universeId}`
			);

			if (!gameRes.ok) {
				throw new Error(`Games API ${gameRes.status}`);
			}

			const gameJson: any = await gameRes.json();
			const game = gameJson.data?.[0];

			if (!game) {
				throw new Error("Game not found.");
			}

			// Icon
			const iconRes = await fetch(
				`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
			);

			const iconJson: any = await iconRes.json();
			const icon = iconJson.data?.[0]?.imageUrl;

			// Thumbnail
			const thumbRes = await fetch(
				`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`
			);

			const thumbJson: any = await thumbRes.json();
			const thumbnail =
				thumbJson.data?.[0]?.thumbnails?.[0]?.imageUrl;

			const embed = new EmbedBuilder()
				.setColor(0x00A2FF)
				.setTitle(game.name)
				.setURL(
					`https://www.roblox.com/games/${game.rootPlaceId}`
				)
				.setDescription("Current live game statistics.")
				.addFields(
					{
						name: "👥 Players",
						value: game.playing.toLocaleString(),
						inline: true
					},
					{
						name: "⭐ Favorites",
						value: game.favoritedCount.toLocaleString(),
						inline: true
					},
					{
						name: "👁️ Visits",
						value: game.visits.toLocaleString(),
						inline: true
					}
				)
				.setFooter({
					text: "UltraWORKS • Roblox Statistics"
				})
				.setTimestamp();

			if (icon) embed.setThumbnail(icon);
			if (thumbnail) embed.setImage(thumbnail);

			await interaction.editReply({
				embeds: [embed]
			});
		} catch (err) {
			console.error(err);

			await interaction.editReply(
				"❌ Failed to fetch Roblox game statistics."
			);
		}
	}
};
