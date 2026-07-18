import about from "../commands/about.js";
import appointmap from "../commands/appointmap.js";
import ban from "../commands/ban.js";
import createcode from "../commands/createcode.js";


const commands: Record<string, any> = {
	about,
	appointmap,
	ban,
	createcode
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


	await command.execute(
		interaction
	);

}
