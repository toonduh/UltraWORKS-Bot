import {
	SlashCommandBuilder
} from "discord.js";

import {
	sendRobloxCommand
} from "../utils/bridge.js";


export default {

	data:
		new SlashCommandBuilder()
			.setName("appointmap")
			.setDescription(
				"Appoints a Roblox map"
			)

			.addStringOption(option =>
				option
					.setName("map")
					.setDescription("Map name")
					.setRequired(true)
			),


	async execute(interaction:any){

		await interaction.deferReply();


		const map =
			interaction.options.getString(
				"map",
				true
			);


		await sendRobloxCommand(
			"appointmap",
			{
				map
			}
		);


		await interaction.editReply(
			`Appointed Roblox map: ${map}`
		);

	}

};
