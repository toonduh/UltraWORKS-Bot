export async function getRobloxHeadshot(
	userId:string
){

	const response = await fetch(
		`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png`
	);


	const data:any =
		await response.json();


	return data.data?.[0]?.imageUrl;

}

export async function getRobloxAssetThumbnail(
	assetId:string
){

	const response = await fetch(
		`https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=Png`
	);


	const data:any =
		await response.json();


	return data.data?.[0]?.imageUrl;

}

export async function getRobloxUserId(username: string) {
	const response = await fetch(
		"https://users.roblox.com/v1/usernames/users",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				usernames: [username],
				excludeBannedUsers: false
			})
		}
	);

	const data: any = await response.json();

	return data.data?.[0]?.id ?? null;
}
