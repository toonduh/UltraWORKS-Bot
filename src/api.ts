import express from "express";

const app = express();

app.use(express.json());

let commandQueue: any[] = [];

function checkAuth(req: express.Request) {
    const auth = req.headers["x-bridge-key"];

    return auth === process.env.BRIDGE_KEY;
}

app.post("/command", (req, res) => {
    if (!checkAuth(req)) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    console.log("Received Roblox command:", req.body);

    commandQueue.push({
        id: Date.now().toString(),
        ...req.body
    });

    res.json({
        success: true
    });
});


app.get("/commands", (req, res) => {
    if (!checkAuth(req)) {
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
