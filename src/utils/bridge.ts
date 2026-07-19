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


		console.log(
			"Roblox command queued:",
			type
		);

	}

	finally {

		clearTimeout(timeout);

	}

}



export async function sendRobloxQuery(
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



		const command =
			await response.json();



		if (!command.id) {

			throw new Error(
				"Bridge did not return command id"
			);

		}



		for (
			let attempt = 0;
			attempt < 20;
			attempt++
		) {

			await new Promise(resolve =>
				setTimeout(resolve, 1000)
			);



			const result =
				await fetch(
					`${bridgeUrl}/response/${command.id}`,
					{
						headers: {
							"Authorization": bridgeKey
						}
					}
				);



			if (result.status === 200) {

				return await result.json();

			}

		}



		throw new Error(
			"Timed out waiting for Roblox response"
		);


	}

	finally {

		clearTimeout(timeout);

	}

}
