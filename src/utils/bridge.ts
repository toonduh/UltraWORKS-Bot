export async function sendRobloxCommand(
	type: string,
	data: any
) {

	const bridgeUrl = process.env.BRIDGE_URL;
	const bridgeKey = process.env.BRIDGE_KEY;

	if (!bridgeUrl || !bridgeKey) {
		throw new Error(
			"Missing BRIDGE_URL or BRIDGE_KEY"
		);
	}

	const controller = new AbortController();

	const timeout = setTimeout(
		() => controller.abort(),
		10000
	);

	try {

		console.log(
			"Sending Roblox command:",
			{
				type,
				data
			}
		);

		const response = await fetch(
			`${bridgeUrl}/command`,
			{
				method: "POST",

				headers: {
					"Content-Type": "application/json",
					"Authorization": bridgeKey
				},

				body: JSON.stringify({
					type,
					data
				}),

				signal: controller.signal
			}
		);

		if (!response.ok) {
			throw new Error(
				`Bridge returned ${response.status}`
			);
		}

		return;

	}
	finally {

		clearTimeout(timeout);

	}

}
