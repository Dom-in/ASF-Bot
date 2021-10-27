const Discord = require('discord.js');
const config = require('./configs/config.json');
const client = new Discord.Client({
        intents: ["GUILDS","GUILD_MEMBERS","GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"]
});
const Enmap = require('enmap')
const fs = require('fs')
const fetch = require('node-fetch');

//Can be Changed/Updated
const RconCommandsUse = ['redeem', 'addlicense', 'pause', 'stop', 'start', 'resume', 'restart', 'update', 'play', 'commands', 'version', 'balance', 'stats'];
const BotVersion = 'v0.0.1'
//Can be Changed/Updated

client.once('ready', () => {
	console.log('[ASF-Bot] I am ready!');
});

client.on("ready", () => {     
    client.commands = new Enmap();
        fs.readdir("./commands/", (err, files) => {
        if (err) return console.error(err);
        files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
    });
});
      
client.on("message", async (message) => {
        if (message.author.bot) return;
        if (!message.author.id == config.secruity.UID) return;
                if (message.channel.type === "dm") return;
                        let prefix = config.bot.prefix;
                        let messageArray = message.content.split(" ");
                        let cmd = messageArray[0].toLowerCase();
                        let args = messageArray.slice(1);
                        if (!message.content.toLowerCase().startsWith(prefix)) return;

                //CHECK IF NEEDED TO RUN IT IN BOT OR RCON
        if(RconCommandsUse.includes(cmd.slice(prefix.length))) {
                let command = {Command: message.content.slice(prefix.length)}
                fetch("http://"+config.secruity.IP+"/Api/Command?password="+config.secruity.ASF_PASSWORD, {
                        method: "post",
                        body: JSON.stringify(command),
                        headers: {"Content-Type": "application/json"}
                }).then(res => res.json())
                .then(body => {
                        if (body.Success){
                        const RconModuleEmbed = new Discord.MessageEmbed()
                                .setColor('AQUA')
                                .setAuthor('ASF-BOT Rcon Commands')
                                .setDescription(body.Result)
                                .setTimestamp()
                                .setFooter(`ASF-Bot ${BotVersion}`, 'https://cdn.discordapp.com/icons/267292556709068800/49f0d4a116dfab2b6c5ad92c079c9070.png?size=512');
                        message.channel.send({ embeds: [RconModuleEmbed] });

                        } else {
                        console.log("Error: " + body)
                        }
                })
                //STOP CHECK IF NEEDED TO RUN IT IN BOT OR RCON
        } else {

                let commandfile = client.commands.get(cmd.slice(prefix.length));
                if (commandfile) commandfile.run(client, message, args, BotVersion);
        }
        })
})


client.login(config.bot.token);
