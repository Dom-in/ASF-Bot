const { REST, Routes } = require('discord.js');
const config = require('./configs/config.json');
const fetch = require('node-fetch');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function fetchBots() {
    try {
        const response = await fetch("https://" + config.secruity.IP + "/Api/Bot/ASF", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authentication: config.secruity.IPC_PASSWORD,
            },
        });
        const body = await response.json();
        if (body.Success) {
            return Object.keys(body.Result);
        }
        throw new Error("Failed to fetch bot names");
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

const staticCommands = [
    {
        "name": "botversion",
        "description": "Discord Bot-version"
    },
    {
        "name": "exit",
        "description": "Ends ASF Process"
    },
    {
        "name": "restart",
        "description": "Restart ASF"
    },
    {
        "name": "update",
        "description": "Update ASF"
    }
];

async function registerCommands() {
    const botNames = await fetchBots();

    const basic = ["resume", "start", "stop"].map((command) => ({

        "name": command,
        "description": `${command.charAt(0).toUpperCase() + command.slice(1)} ASF Bot`,
        "options": [
            {
                "name": "botname",
                "description": `The bot to ${command}`,
                "type": 3,
                "required": false,
                "choices": botNames.map(bot => ({
                    name: bot,
                    value: bot
                }))
            }
        ]
    }));

    const pause = {
        "name" : "pause",
        "description": "Pause bots farming",
        "options": [
            {
                "name": "botname",
                "description": "The bot to pause",
                "type": 3,
                "required": false,
                "choices": botNames.map(bot => ({
                    name: bot,
                    value: bot
                }))
            },
            {
                "name": "time",
                "description": "How long to pause the bot(s) for in seconds",
                "type": 4,
                "required": false
            }
        ]
    }

    const addLicense = {
        "name": "addlicense",
        "description": "Add licences to you account",
        "options": [
            {
                "name": "license_ids",
                "description": "The ids to add",
                "type": 3,
                "required": true
            },
            {
                "name": "botname",
                "description": "The bot to addlicense",
                "type": 3,
                "required": false,
                "choices": botNames.map(bot => ({
                    name: bot,
                    value: bot
                }))
            }
        ]
    };

    const redeemPoints = {
        "name": "redeempoints",
        "description": "Redeem items from the pointshop",
        "options": [
            {
                "name": "item_ids",
                "description": "The ids to redeem",
                "type": 3,
                "required": true
            },
            {
                "name": "botname",
                "description": "The bot to redeem",
                "type": 3,
                "required": false,
                "choices": botNames.map(bot => ({
                    name: bot,
                    value: bot
                }))
            }
        ]
    };

    const commands = [...staticCommands, ...basic, pause, addLicense, redeemPoints];

    const rest = new REST({ version: '10' }).setToken(config.bot.token);

    try {
        console.log('Started refreshing application (/) commands. (This might take a bit)');

        await rest.put(
            Routes.applicationGuildCommands(
                config.bot.ID,
                config.secruity.SERVER_ID
            ),
            { body: [] }
        );
        console.log('Successfully deleted all commands.');

        await rest.put(
            Routes.applicationGuildCommands(
                config.bot.ID,
                config.secruity.SERVER_ID
            ),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');

        process.exit(0);
    } catch (error) {
        console.error(`Error during command registration: ${error}`);
        process.exit(1);
    }
}

registerCommands();