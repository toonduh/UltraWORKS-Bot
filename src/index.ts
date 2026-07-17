import "./api.js";

import {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    EmbedBuilder
} from "discord.js";

const TOKEN = process.env.DISCORD_TOKEN!;
const CLIENT_ID = "1527788728292999369";
const BRIDGE_URL = process.env.BRIDGE_URL!;
const BRIDGE_KEY = process.env.BRIDGE_KEY!;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

async function sendRobloxCommand(
    type: string,
    data: object = {}
) {
    console.log("Sending Roblox command:", { type, data });
    
    const response = await fetch(
        `${BRIDGE_URL}/command`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": BRIDGE_KEY
            },
            body: JSON.stringify({ type, data }),
            signal: AbortSignal.timeout(10000)
        }
    );

    console.log("Bridge response:", response.status);

    if (!response.ok) {
        throw new Error(`Bridge returned ${response.status}`);
    }

    return response.json();
}

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!"
    },
    {
        name: "about",
        description: "Shows information about UltraWORKS Bot."
    },
    {
        name: "announce",
        description: "Send an announcement to Lurking Giants.",
        options: [
            {
                name: "message",
                description: "Announcement message",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "appointmap",
        description: "Sets the map for all Lurking Giants servers.",
        options: [
            {
                name: "map",
                description: "The map to set.",
                type: 3,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: "10" })
    .setToken(TOKEN);

async function registerCommands() {
    await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
    );
    console.log("Commands registered!");
}

client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    await registerCommands();
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }

    if (interaction.commandName === "about") {
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle("About UltraWORKS Bot")
            .setDescription("UltraWORKS Bot is a Discord integration bot created for Lurking Giants.")
            .addFields({
                name: "Purpose",
                value: "Its main purpose is to bridge commands between the Discord server and the game, allowing server actions and game features to communicate seamlessly."
            })
            .setFooter({ text: "Lurking Giants • UltraWORKS" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    if (interaction.commandName === "appointmap") {
        const map = interaction.options.getString("map", true);
        await interaction.deferReply();

        try {
            await sendRobloxCommand("appointmap", { map });

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle("Map Appointed")
                .setDescription(`All Lurking Giants servers have been instructed to use **${map}**.`)
                .setFooter({ text: "UltraWORKS Bot • Lurking Giants" })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch(error) {
            console.error(error);
            await interaction.editReply("❌ Failed to appoint map.");
        }
    }
});

client.login(TOKEN);
