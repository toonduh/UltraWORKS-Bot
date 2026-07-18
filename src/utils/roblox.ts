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
