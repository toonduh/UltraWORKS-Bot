import {
	SlashCommandBuilder,
	EmbedBuilder
} from "discord.js";

import { sendRobloxCommand } from "../utils/bridge.js";

const awardConfig: Record<string, {
	image?: string;
	color: number;
}> = {
	coins: {
		image: "https://www.roblox.com/asset-thumbnail/image?assetId=119376087221654&width=420&height=420&format=png",
		color: 0xFFD700
	},

	robux: {
		color: 0x00A86B
	},

	item: {
		color: 0x9B59B6
	}
};


export default {
	data: new SlashCommandBuilder()
		.setName("createcode")
		.setDescription("Creates a redeemable code")

		.addStringOption(option =>
			option
				.setName("codename")
				.setDescription("Code name")
				.setRequired(true)
		)

		.addStringOption(option =>
			option
				.setName("codetype")
				.setDescription("Code type")
				.setRequired(true)
		)

		.addStringOption(option =>
			option
				.setName("award")
				.setDescription("Award type")
				.setRequired(true)
		)

		.addIntegerOption(option =>
			option
				.setName("amount")
				.setDescription("Award amount")
				.setRequired(true)
		)

		.addBooleanOption(option =>
			option
				.setName("onetime")
				.setDescription("Can each player redeem once?")
				.setRequired(true)
		)

		.addIntegerOption(option =>
			option
				.setName("stock")
				.setDescription("Stock (-1 = infinite)")
				.setRequired(true)
		)

		.addIntegerOption(option =>
			option
				.setName("starting")
				.setDescription("Starting Unix timestamp")
				.setRequired(true)
		)

		.addIntegerOption(option =>
			option
				.setName("expiration")
				.setDescription("Expiration Unix timestamp")
				.setRequired(true)
		),


	async execute(interaction: any) {

		await interaction.deferReply();


		const codename =
			interaction.options.getString("codename", true);

		const codetype =
			interaction.options.getString("codetype", true);

		const award =
			interaction.options.getString("award", true)
				.toLowerCase();

		const amount =
			interaction.options.getInteger("amount", true);

		const onetime =
			interaction.options.getBoolean("onetime", true);

		const stock =
			interaction.options.getInteger("stock", true);

		const starting =
			interaction.options.getInteger("starting", true);

		const expiration =
			interaction.options.getInteger("expiration", true);



		await sendRobloxCommand(
			"createcode",
			{
				codename,
				codetype,
				award,
				amount,
				onetime,
				stock,
				starting,
				expiration
			}
		);



		const config =
			awardConfig[award] ?? {
				color: 0x5865F2
			};



		const embed =
			new EmbedBuilder()
				.setTitle("CODE CREATED")
				.setDescription(
					"A new redeemable code has been created."
				)
				.setColor(config.color)

				.addFields(
					{
						name: "Code",
						value: `\`${codename}\``,
						inline: true
					},

					{
						name: "Type",
						value: codetype,
						inline: true
					},

					{
						name: "Award",
						value: award,
						inline: true
					},

					{
						name: "Amount",
						value: amount.toString(),
						inline: true
					},

					{
						name: "One Time Redeem",
						value: onetime ? "Yes" : "No",
						inline: true
					},

					{
						name: "Stock",
						value:
							stock === -1
								? "Infinite"
								: stock.toString(),
						inline: true
					},

					{
						name: "Starts",
						value: `<t:${starting}:F>`,
						inline: false
					},

					{
						name: "Expires",
						value: `<t:${expiration}:F>`,
						inline: false
					}
				)

				.setTimestamp();



		if (config.image) {
			embed.setThumbnail(config.image);
		}



		await interaction.editReply({
			embeds: [
				embed
			]
		});
	}
};
