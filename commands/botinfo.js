const Discord = require('discord.js');
const config = require("../configs/config.json");
const fetch = require('node-fetch');

module.exports = {
    name: "botinfo",
    run: async (bot, message, args, BotVersion) => {
        let name = args[0]
        if(!name) return message.channel.send('**[ERROR]** You did not mention bots name!');
        fetch('http://'+config.secruity.IP+'/Api/Bot/'+name+'?password='+config.secruity.ASF_PASSWORD)
        .then(res => res.json())
        .then(async json => {
        if(!json.Result[name]) return message.channel.send('**[ERROR]** '+name+' is not a valid bots name!');
        let data = json.Result[name]
        
        //Start CardsFarmer Functions
        let CurrentGamesFarming = data.CardsFarmer.CurrentGamesFarming
        let TPT = '00:00:00'

        if(CurrentGamesFarming.length == 0) {
            CurrentGamesFarming = "No Games To Idle"
        } else {
            CurrentGamesFarming = CurrentGamesFarming[0].GameName+' | '+CurrentGamesFarming[0].CardsRemaining+" Cards"
            TPT = CurrentGamesFarming[0].HoursPlayed
        }
        let Paused = data.CardsFarmer.Paused
        if(Paused) {
            Paused = "Yes"
        } else {
            Paused = "No"
        }
        let TimeRemaining = data.CardsFarmer.TimeRemaining
        //Stop CardsFarmer Functions

        //Start BotInfo Functions
        let HasMobileAuthenticator = data.HasMobileAuthenticator
            if(HasMobileAuthenticator) {
                HasMobileAuthenticator = "Yes"
            } else {
                HasMobileAuthenticator = "No"
            }
        let IsConnectedAndLoggedOn = data.IsConnectedAndLoggedOn
            if(IsConnectedAndLoggedOn) {
                IsConnectedAndLoggedOn = "Yes"
            } else {
                IsConnectedAndLoggedOn = "No"
            }

            const response = await fetch('http://'+config.secruity.IP+'/swagger/ASF/swagger.json');
            const codes = await response.json();
            let CurrencyMarks = codes.components.schemas['SteamKit2.ECurrencyCode']['x-definition']

        //Stop BotInfo Functions
        const BotInfo = new Discord.MessageEmbed()
            .setAuthor(data.BotName, `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/31/${data.AvatarHash}_full.jpg`)
            .addField('__**Bot Info**__', `Balance: ${data.WalletBalance/100} ${Object.keys(CurrencyMarks).find(value => CurrencyMarks[value] === data.WalletCurrency)}\nOnline: ${IsConnectedAndLoggedOn}\nRedeem In Background: ${data.GamesToRedeemInBackgroundCount}\nMobile Authenticator: ${HasMobileAuthenticator}`, true)
            .addField('__**Card Farming**__', `Current Game: ${CurrentGamesFarming}\nGame Play Time: ${TPT}\nTotal Time Remaining: ${TimeRemaining}\nPaused: ${Paused}`, true)
            .setColor('AQUA')
            .setTimestamp()
            .setFooter(`ASF-Bot ${BotVersion}`, 'https://cdn.discordapp.com/icons/267292556709068800/49f0d4a116dfab2b6c5ad92c079c9070.png?size=512');
        message.channel.send({ embeds: [BotInfo] });
        })  
    }
}