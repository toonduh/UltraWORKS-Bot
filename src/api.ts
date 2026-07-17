import express from "express";

const app = express();

app.use(express.json());

app.post("/command", (req, res) => {
	const key = req.headers.authorization;

	if (!process.env.BRIDGE_KEY) {
		console.error("BRIDGE_KEY is missing");
		return res.status(500).json({
			error: "Server bridge key not configured"
		});
	}

	if (key !== process.env.BRIDGE_KEY) {
		return res.status(401).json({
			error: "Unauthorized"
		});
	}

	const command = req.body;

	console.log("Received Roblox command:", command);

	// TODO:
	// Forward command to Roblox here

	return res.json({
		success: true,
		command
	});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Bridge API running on port ${port}`);
});
