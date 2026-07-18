import {
	SlashCommandBuilder
} from "discord.js";


export default {

	data:
		new SlashCommandBuilder()
			.setName("about")
			.setDescription(
				"Shows information about UltraWORKS Bot"
			),


	async execute(interaction:any){

		await interaction.reply(
			"UltraWORKS Bot bridges Discord commands with Roblox games."
		);

	}

};
