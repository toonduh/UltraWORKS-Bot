import {
	SlashCommandBuilder
} from "discord.js";


import {
	sendRobloxCommand
} from "../utils/bridge.js";


export default {

	data:
		new SlashCommandBuilder()
		.setName("createcode")
		.setDescription(
			"Creates a redeemable code"
		)

		.addStringOption(o =>
			o.setName("codename")
			.setDescription("Code name")
			.setRequired(true)
		)

		.addStringOption(o =>
			o.setName("codetype")
			.setDescription("Code type")
			.setRequired(true)
		)

		.addStringOption(o =>
			o.setName("award")
			.setDescription("Award")
			.setRequired(true)
		)

		.addIntegerOption(o =>
			o.setName("amount")
			.setDescription("Amount")
			.setRequired(true)
		),


	async execute(interaction:any){

		await interaction.deferReply();


		const data = {

			codename:
				interaction.options.getString("codename"),

			codetype:
				interaction.options.getString("codetype"),

			award:
				interaction.options.getString("award"),

			amount:
				interaction.options.getInteger("amount")

		};


		await sendRobloxCommand(
			"createcode",
			data
		);


		await interaction.editReply(
			"Code created."
		);

	}

};
