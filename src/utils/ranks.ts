export const Roles = {

	OWNER: "1508200515656351784",
	DEVELOPER: "1508263655857459280",
	ADMIN: "1508244882521591879",
	MODERATOR: "1508247760900460694"

} as const;



export const CommandPermissions: Record<string, string[]> = {


	// Moderation
	ban: [
		Roles.MODERATOR,
		Roles.ADMIN,
		Roles.OWNER
	],

	unban: [
		Roles.MODERATOR,
		Roles.ADMIN,
		Roles.OWNER
	],


	// Data management
	clear: [
		Roles.ADMIN,
		Roles.OWNER
	],


	// Development
	appointmap: [
		Roles.DEVELOPER,
		Roles.ADMIN,
		Roles.OWNER
	],

	createcode: [
		Roles.DEVELOPER,
		Roles.ADMIN,
		Roles.OWNER
	],


	// Dangerous command
	restart: [
		Roles.ADMIN,
		Roles.OWNER
	]

};



export function HasPermission(
	interaction: any,
	commandName: string
): boolean {


	const allowedRoles =
		CommandPermissions[commandName];


	// Command is public
	if (!allowedRoles)
		return true;



	const member =
		interaction.member;



	if (!member?.roles?.cache)
		return false;



	return member.roles.cache.some(
		(role: any) =>
			allowedRoles.includes(role.id)
	);

}
