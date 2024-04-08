const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const Config = require('../../config.json')
const USER_INSTATNCE = require('../../USER_INSTATNCE.json')
const axios = require('axios');
const fs = require("fs"); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loginas")
    .setDescription("Logs you into an INSTANCE account")
    .addStringOption(option =>
      option.setName('account_name')
        .setDescription('Your ASF account name')
        .setRequired(false)),
  run: async (interaction) => {
    let LastInstance = USER_INSTATNCE.Loggined_As

    if (!interaction.options.getString('account_name')) {
        interaction.reply('You are loggined as `'+LastInstance+'`')
    } else {
        //Here code for login
        NewUserLoggin = interaction.options.getString('account_name')

        const config = {
            method: 'get',
            url: 'http://'+Config.ASF_SETTINGS.IP+'/Api/Bot/'+NewUserLoggin.replace(" ", "%20"), // Make sure the URL is correctly encoded
            headers: { 
                'accept': 'application/json',
                'Authentication': Config.ASF_SETTINGS.Password
            }
        };
        
        axios(config)
            .then(async function (response) {
                if(!response.data.Result[interaction.options.getString('account_name').replace(/%20/g, " ")]) return interaction.reply('This user does not exist!');

                USER_INSTATNCE.Loggined_As = interaction.options.getString('account_name').replace(/%20/g, " ")

                fs.writeFile("USER_INSTATNCE.json", JSON.stringify(USER_INSTATNCE), err => {
                    if (err) throw err;
                    console.log(JSON.stringify(USER_INSTATNCE))
                    interaction.reply('Done! Loggined as `'+interaction.options.getString('account_name').replace(/%20/g, " ")+'`')
                }); 

            }).catch(function (error) {
                console.log(error);
            });
    }

  },
  
};