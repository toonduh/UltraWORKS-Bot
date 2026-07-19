import about from "../commands/about.js";
import appointmap from "../commands/appointmap.js";
import ban from "../commands/ban.js";
import createcode from "../commands/createcode.js";
import clear from "../commands/clear.js";
import gamestats from "../commands/gamestats.js";
import find from "../commands/find.js";
import restart from "../commands/restart.js";
import topcoins from "../commands/topcoins.js";
import unban from "../commands/unban.js";

import {
	HasPermission
} from "../utils/ranks.js";


const commands: Record<string, any> = {

	about,
	appointmap,
	ban,
	createcode,
	clear,
	gamestats,
	find,
	restart,
	topcoins,
	unban

};



export async function handleInteraction(
	interaction: any
){

	if (!interaction.isChatInputCommand())
		return;



	const command =
		commands[interaction.commandName];



	if (!command)
		return;



	if (
		!HasPermission(
			interaction,
			interaction.commandName
		)
	) {

		await interaction.reply({

			content:
				"❌ You do not have permission to use this command.",

			ephemeral: true

		});

		return;

	}



	await command.execute(
		interaction
	);

}
