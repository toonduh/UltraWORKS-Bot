import about from "../commands/about.js";
import appointmap from "../commands/appointmap.js";
import ban from "../commands/ban.js";
import createcode from "../commands/createcode.js";


const commands = {
	about,
	appointmap,
	ban,
	createcode
};


export async function handleInteraction(
	interaction:any
){

	if(!interaction.isChatInputCommand())
		return;


	const command =
		commands[
			interaction.commandName
		];


	if(!command)
		return;


	try {

		await command.execute(
			interaction
		);

	}
	catch(error){

		console.error(error);


		if(interaction.deferred)
		{
			await interaction.editReply(
				"Command failed."
			);
		}
		else
		{
			await interaction.reply(
				"Command failed."
			);
		}
	}
}
