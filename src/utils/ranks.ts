export const Roles = {

	OWNER: "1508200515656351784",
	DEVELOPER: "1508263655857459280",
	ADMIN: "1508244882521591879",
	MODERATOR: "1508247760900460694",
	DS_OWNER: "1522001373544059000",
	DS_SCRIPTER: "1522001376660426792"

} as const;



export const CommandPermissions: Record<string, string[]> = {


	// Moderation
	ban: [
		Roles.MODERATOR,
		Roles.ADMIN,
		Roles.OWNER,
		Roles.DS_SCRIPTER,
		Roles.DS_OWNER,
	],

	unban: [
		Roles.MODERATOR,
		Roles.ADMIN,
		Roles.OWNER,
		Roles.DS_SCRIPTER,
		Roles.DS_OWNER
	],


	// Data management
	clear: [
		Roles.ADMIN,
		Roles.OWNER,
		Roles.DS_SCRIPTER,
		Roles.DS_OWNER
	],


	// Development
	appointmap: [
		Roles.DEVELOPER,
		Roles.ADMIN,
		Roles.OWNER,
		Roles.DS_SCRIPTER,
		Roles.DS_OWNER
	],

	createcode: [
		Roles.DEVELOPER,
		Roles.ADMIN,
		Roles.OWNER,
		Roles.DS_SCRIPTER,
		Roles.DS_OWNER
	],


	// Dangerous command
	restart: [
		Roles.ADMIN,
		Roles.OWNER,
		Roles.DS_SCRIPTER,
		Roles.DS_OWNER,
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
