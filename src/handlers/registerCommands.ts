import {
	REST,
	Routes
} from "discord.js";


import about from "../commands/about.js";
import appointmap from "../commands/appointmap.js";
import ban from "../commands/ban.js";
import createcode from "../commands/createcode.js";


const commands = [
	about.data,
	appointmap.data,
	ban.data,
	createcode.data
].map(
	command => command.toJSON()
);


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
