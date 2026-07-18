import {
	REST,
	Routes
} from "discord.js";


import about from "../commands/about.js";
import appointmap from "../commands/appointmap.js";
import ban from "../commands/ban.js";
import clear from "../commands/clear.js";
import createcode from "../commands/createcode.js";
import gamestats from "../commands/gamestats.js";
import find from "../commands/find.js";
import restart from "../commands/restart.js";
import topcoins from "../commands/topcoins.js";



const commands = [
	about.data,
	appointmap.data,
	ban.data,
	clear.data,
	createcode.data,
	gamestats.data,
	find.data,
	restart.data,
	topcoins.data
].map(command => command.toJSON());



export async function registerCommands(
	clientId:string
){

	const rest = new REST({
		version:"10"
	}).setToken(
		process.env.DISCORD_TOKEN!
	);



	await rest.put(
		Routes.applicationCommands(clientId),
		{
			body:commands
		}
	);

}
