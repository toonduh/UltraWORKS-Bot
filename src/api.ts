import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const BRIDGE_KEY = process.env.BRIDGE_KEY!;

app.use(express.json());

app.post("/command", async (req, res) => {
    const auth = req.headers.authorization;

    if(auth !== BRIDGE_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const command = req.body;
    console.log("Received Roblox command:", command);

    // Later: Send command to Roblox Open Cloud here

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Bridge API running on port ${PORT}`);
});
