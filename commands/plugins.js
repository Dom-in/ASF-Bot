const Discord = require('discord.js');
const config = require("../configs/config.json");
const fetch = require('node-fetch');

module.exports = {
    name: "botinfo",
    run: async (bot, message, args, BotVersion) => {
        fetch('http://'+config.secruity.IP+'/Api/Plugins?password='+config.secruity.ASF_PASSWORD)
        .then(res => res.json())
        .then(json => {
        let data = json.Result
        let len = Object.keys(data).length;
        let PluginList = "";
        let i = 0;
        while (i < len) {
            PluginList += data[i].Name+"\n";
            i++;
        }
        if(PluginList.length == 0) PluginList = 'No Plugins Found';

        const BotInfo = new Discord.MessageEmbed()
        .addField('__**Plugin List**__', PluginList, true)
        .setColor('AQUA')
        .setTimestamp()
        .setFooter(`ASF-Bot ${BotVersion}`, 'https://cdn.discordapp.com/icons/267292556709068800/49f0d4a116dfab2b6c5ad92c079c9070.png?size=512');
        message.channel.send({ embeds: [BotInfo] });
        })  
    }
}