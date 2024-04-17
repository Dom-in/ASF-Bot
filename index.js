const Discord = require('discord.js');
const config = require('./configs/config.json');
const { DateTime } = require('luxon');
const fs = require('fs')
const fetch = require('node-fetch');
const client = new Discord.Client({ intents: 34815 });

const re1 = /addlicense\sasf\s(s\/\d+(?:,\s)?)*/;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Can be Changed/Updated
//commands with one optional botname argument
const commandsopt1 = ['pause', 'resume', 'start', 'stop', 'status'];
const BotVersion = 'v1.1.0';
//Can be Changed/Updated


client.once('ready', (c) => {

        console.log(`${getTime()} | [${c.user.username}] I am ready!`);
        heartbeat();

});



client.on('interactionCreate', async (interaction) => {
        if (interaction.user.id != config.secruity.USER_ID) return;
        if (!interaction.isChatInputCommand()) return;

        let result;

        const RconModuleEmbed = new Discord.EmbedBuilder()
                .setColor('#00ffff')
                .setAuthor({
                        name: "ASF-BOT Rcon Commands"
                })
                .setDescription("Fetching data...")
                .setTimestamp(Date.now())
                .setFooter({
                        text: `ASF-Bot ${BotVersion}`,
                        iconURL: `https://cdn.discordapp.com/avatars/${config.client.ID}/${client.user.avatar}.webp?size=512`
                });

        if (commandsopt1.includes(interaction.commandName)) {
                interaction.reply({ embeds: [RconModuleEmbed] }).then(async (message) => {
                        if (interaction.options.getString('botname') != null) {
                                result = interaction.commandName + " " + interaction.options.getString('botname');
                        } else {
                                result = interaction.commandName;
                        }
                        await message.edit(await IPCsend(result));
                });
        }

        switch (interaction.commandName) {
                case 'ping':
                        const startTimestamp = Date.now();
                        await interaction.reply('Pinging...').then(async (pingMessage) => {
                                const latency = Date.now() - startTimestamp;
                                await pingMessage.edit(`Pong! The bot's latency is ${latency}ms.`);
                        });
                        break;

                case 'commands':
                        interaction.reply({ embeds: [RconModuleEmbed] }).then(async (message) => {

                                await message.edit(IPCFormatCommands());
                        });
                        break;

                case 'botversion':
                        await interaction.reply(`${BotVersion}`);
                        break;

                case 'version':
                        interaction.reply({ embeds: [RconModuleEmbed] }).then(async (message) => {
                                result = await IPCsend(interaction.commandName);
                                await message.edit(result);
                        });
                        break;

                case 'redeem':
                        interaction.reply({ embeds: [RconModuleEmbed] }).then(async (message) => {

                                if (interaction.options.getString('botname') != null) {
                                        result = interaction.commandName + " " + interaction.options.getString('botname') + " " + interaction.options.getString('key');
                                } else {
                                        result = "addlicense asf " + interaction.options.getString('key');
                                }
                                await message.edit(await IPCsend(result));
                        });
                        break;

                case 'update':
                        interaction.reply({ embeds: [RconModuleEmbed] }).then(async (message) => {
                                result = await IPCsend(interaction.commandName);
                                await message.edit(result);
                        });
                        break;

                case 'exit':
                        interaction.reply({ embeds: [RconModuleEmbed] }).then(async (message) => {
                                result = await IPCsend(interaction.commandName);
                                await message.edit(result);
                        });
                        break;
        }
});

client.on("messageCreate", async (message) => {
        if (!message.author.bot) return;
        if (message.author.id != config.fsbot.ID) return;
        if (message.channel.id != config.fsbot.CHANNEL_ID) return;
        for (let i = 0; i < message.embeds.length; i++) {
                if (message.embeds[i].description === undefined) return;
                if (message.embeds[i].description.includes("addlicense") && message.embeds[i].description.includes("steam")) {
                        if ((cmdd = message.embeds[i].description.match(re1)) != null) {

                                let command = { Command: cmdd[0].slice() }

                                fetch("https://" + config.secruity.IP + "/Api/Command", {
                                        method: "post",
                                        body: JSON.stringify(command),
                                        headers: {
                                                "Content-Type": "application/json",
                                                "Authentication": config.secruity.IPC_PASSWORD
                                        }
                                }).then(res => res.json())
                                        .then(body => {
                                                if (body.Success) {

                                                        let lines = body.Result.split('\n');
                                                        lines = lines.filter(line => line.trim() !== '');
                                                        let result = lines.join(`\n${getTime()} | `);
                                                        console.log(`${getTime()} | ` + result);

                                                        const RconModuleEmbed = new Discord.EmbedBuilder()
                                                                .setColor('#00ffff')
                                                                .setAuthor({
                                                                        name: "ASF-BOT Rcon Commands"
                                                                })
                                                                .setDescription(body.Result)
                                                                .setTimestamp(Date.now())
                                                                .setFooter({
                                                                        text: `ASF-Bot ${BotVersion}`,
                                                                        iconURL: `https://cdn.discordapp.com/avatars/${config.client.ID}/${client.user.avatar}.webp?size=512`
                                                                });
                                                        message.channel.send({ embeds: [RconModuleEmbed] });

                                                } else {
                                                        console.log("Error:", body.title);
                                                        console.log("Status:", body.status);

                                                        if (Array.isArray(body.errors)) {
                                                                console.log("Validation Errors:");
                                                                body.errors.forEach((error, index) => {
                                                                        console.log(`Error ${index + 1}:`, error.message);
                                                                        console.log("Field:", error.field); // If available, log the field related to the error
                                                                        console.log("Details:", error.details); // If available, log additional details about the error
                                                                });
                                                        } else {
                                                                console.log("Unknown validation error occurred");
                                                        }

                                                        console.log("Trace ID:", body.traceId);
                                                }

                                        })
                                        .catch(error => {
                                                // Handle fetch or network-related errors
                                                console.error("Fetch error:", error);
                                        });

                        }
                }
        };
});


async function IPCsend(data) {
        try {
                let response = await fetch("https://" + config.secruity.IP + "/Api/Command", {
                        method: "post",
                        body: JSON.stringify({ Command: data }),
                        headers: {
                                "Content-Type": "application/json",
                                "Authentication": config.secruity.IPC_PASSWORD
                        }
                });
                let body = await response.json();
                if (body.Success) {

                        let lines = body.Result.split('\n');
                        lines = lines.filter(line => line.trim() !== '');
                        let result = lines.join(`\n${getTime()} | `);
                        console.log(`${getTime()} | ` + result);

                        const RconModuleEmbed = new Discord.EmbedBuilder()
                                .setColor('#00ffff')
                                .setAuthor({
                                        name: "ASF-BOT Rcon Commands"
                                })
                                .setDescription(body.Result)
                                .setTimestamp(Date.now())
                                .setFooter({
                                        text: `ASF-Bot ${BotVersion}`,
                                        iconURL: `https://cdn.discordapp.com/avatars/${config.client.ID}/${client.user.avatar}.webp?size=512`
                                });
                        return ({ embeds: [RconModuleEmbed] });
                } else {
                        console.log("func Error:", body.title);
                        console.log("func Status:", body.status);

                        if (Array.isArray(body.errors)) {
                                console.log("Validation Errors:");
                                body.errors.forEach((error, index) => {
                                        console.log(`Error ${index + 1}:`, error.message);
                                        console.log("Field:", error.field); // If available, log the field related to the error
                                        console.log("Details:", error.details); // If available, log additional details about the error
                                });
                        } else {
                                console.log("Unknown validation error occurred");
                        }

                        console.log("Trace ID:", body.traceId);
                }


        } catch (error) {
                // Handle fetch or network-related errors
                console.error("Fetch error:", error);
        }
}


function IPCFormatCommands() {
        // Read the commands from the JSON file
        const commands = JSON.parse(fs.readFileSync('./configs/commands.json', 'utf8'));

        const RconModuleEmbed = new Discord.EmbedBuilder()
                .setColor('#00ffff')
                .setTitle('Command List')
                .setTimestamp(Date.now())
                .setFooter({
                        text: `ASF-Bot ${BotVersion}`,
                        iconURL: `https://cdn.discordapp.com/avatars/${config.client.ID}/${client.user.avatar}.webp?size=512`
                });

        // Iterate through the commands and add them as fields
        for (const command of commands) {
                let value = command.description;

                // If the command has options, add them to the value
                if (command.options) {
                        value += ' | ' + command.options.map(option => option.name).join(', ');
                }

                RconModuleEmbed.addFields({ name: command.name, value: value });
        }

        return ({ embeds: [RconModuleEmbed] });
}

async function heartbeat() {
        client.user.setActivity('ASF | pinging...', { type: Discord.ActivityType.WATCHING });
        client.user.setStatus('idle');

        setInterval(async () => {
                try {
                        let response = await fetch("https://" + config.secruity.IP + "/HealthCheck", {
                                method: "get",
                                headers: {
                                        "Content-Type": "application/json",
                                        "Authentication": config.secruity.IPC_PASSWORD
                                }
                        });
                        if (response.status == 200) {
                                if (client.user.presence.activities[0].name != 'ASF | Online') {
                                        console.log(`${getTime()} | Server is online`);
                                        client.user.setActivity('ASF | Online', { type: Discord.ActivityType.WATCHING });
                                        client.user.setStatus('online');
                                };
                        } else if (response.status == 502) {
                                if (client.user.presence.activities[0].name != 'ASF | booting...') {
                                        console.log(`${getTime()} | Server is starting`);
                                        client.user.setActivity('ASF | booting...', { type: Discord.ActivityType.WATCHING });
                                        client.user.setStatus('idle');
                                };
                        } else {
                                console.log(response);
                        }

                } catch (error) {
                        if (error.code == 'ETIMEDOUT') {
                                if (client.user.presence.activities[0].name != 'ASF | Offline') {
                                        console.log(`${getTime()} | Server is offline`);
                                        client.user.setActivity('ASF | Offline', { type: Discord.ActivityType.WATCHING });
                                        client.user.setStatus('dnd');
                                };
                        } else if (error.code == 'ECONNREFUSED') {
                                if (client.user.presence.activities[0].name != 'ASF | booting...') {
                                        console.log(`${getTime()} | Server is starting`);
                                        client.user.setActivity('ASF | booting...', { type: Discord.ActivityType.WATCHING });
                                        client.user.setStatus('idle');
                                };
                        }
                        else {
                                console.error("Fetch error:", error);
                        }

                }
        }, 10000);
}


function getTime(ms) {
        const now = DateTime.local().setZone('Europe/Berlin');
        const newTime = now.plus({ milliseconds: ms });
        const formattedTime = newTime.toFormat('[dd HH:mm:ss]');
        return formattedTime
};

client.login(config.client.token);