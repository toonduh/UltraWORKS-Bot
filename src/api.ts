import express from "express";

const app = express();

app.use(express.json());


let commandQueue: any[] = [];

const responses: Record<string, any> = {};



function checkAuth(req: express.Request) {

	const auth =
		req.headers["authorization"] ||
		req.headers["x-bridge-key"];


	return auth === process.env.BRIDGE_KEY;

}



/*
	Discord -> Railway -> Roblox
*/
app.post("/command", (req, res) => {

	if (!checkAuth(req)) {

		return res.status(401).json({
			error: "Unauthorized"
		});

	}



	const id =
		Date.now().toString();



	const command = {

		id,

		...req.body

	};



	console.log(
		"Received command:",
		command
	);



	commandQueue.push(
		command
	);



	res.json({

		success: true,

		id

	});

});



/*
	Roblox polls commands
*/
app.get("/commands", (req, res) => {

	if (!checkAuth(req)) {

		return res.status(401).json({
			error: "Unauthorized"
		});

	}



	const commands =
		[...commandQueue];



	commandQueue = [];



	res.json(commands);

});



/*
	Roblox -> Railway response
*/
app.post("/response", (req, res) => {

	if (!checkAuth(req)) {

		return res.status(401).json({
			error: "Unauthorized"
		});

	}



	const {
		id,
		response
	} = req.body;



	if (!id) {

		return res.status(400).json({

			error:
				"Missing response id"

		});

	}



	console.log(
		"Received Roblox response:",
		id
	);



	responses[id] =
		response;



	res.json({

		success: true

	});

});



/*
	Discord waits for Roblox result
*/
app.get("/response/:id", (req, res) => {

	if (!checkAuth(req)) {

		return res.status(401).json({
			error: "Unauthorized"
		});

	}



	const response =
		responses[req.params.id];



	if (!response) {

		return res.status(404).json({

			ready: false

		});

	}



	delete responses[req.params.id];



	res.json(response);

});



const port =
	process.env.PORT || 3000;



app.listen(port, () => {

	console.log(
		`Bridge API running on port ${port}`
	);

});
