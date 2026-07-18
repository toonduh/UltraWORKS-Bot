import express from "express";

const app = express();

app.use(express.json());

let commandQueue: any[] = [];

app.post("/command", (req, res) => {
    const auth = req.headers.authorization;

    if (auth !== process.env.BRIDGE_KEY) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    console.log("Received Roblox command:", req.body);

    commandQueue.push(req.body);

    res.json({
        success: true
    });
});


app.get("/commands", (req, res) => {
    const auth = req.headers.authorization;

    if (auth !== process.env.BRIDGE_KEY) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    const commands = [...commandQueue];

    commandQueue = [];

    res.json(commands);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Bridge API running on port ${port}`);
});
