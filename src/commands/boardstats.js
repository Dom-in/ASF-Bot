const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const { SteamLadderAPI } = require("steamladder");
const Config = require('../../config.json')
const steamladder = new SteamLadderAPI(Config.SteamLadder.API);
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boardstats")
    .setDescription("Check stats of your profile on SteamLadder")
    .addStringOption(option =>
      option.setName('account_name')
        .setDescription('Your ASF account name')
        .setRequired(true)),
  run: async (interaction) => {
    
    let stats = {
      XP_Rank : 0,
      PlayTime_Rank : 0,
      Games_Rank : 0
    }

    const config = {
      method: 'get',
      url: 'http://'+Config.ASF_SETTINGS.IP+'/Api/Bot/'+interaction.options.getString('account_name').replace(" ", "%20"), // Make sure the URL is correctly encoded
      headers: { 
          'accept': 'application/json',
          'Authentication': Config.ASF_SETTINGS.Password
      }
  };
  
  axios(config)
      .then(async function (response) {
    if(!response.data.Result[interaction.options.getString('account_name').replace(/%20/g, " ")]) return interaction.reply('Wrong username!');
    let steamIDS = await response.data.Result[interaction.options.getString('account_name').replace(/%20/g, " ")].s_SteamID
    let dataa = await steamladder.getProfile(steamIDS)
    let CountryCode = dataa.steam_user.steam_country_code
    let XP_Rank = dataa.ladder_rank.country.country_xp-1 //Done
    let PlayTime_Rank = dataa.ladder_rank.country.country_playtime-1 //Done
    let Games_Rank = dataa.ladder_rank.country.country_games-1 //Done

    if (XP_Rank >= 99) { XP_Rank = '(UNKNOWN)' };
    if (PlayTime_Rank >= 99) { PlayTime_Rank = '(UNKNOWN)' };
    if (Games_Rank >= 99) { Games_Rank = '(UNKNOWN)' };

    if (PlayTime_Rank != '(UNKNOWN)') {
      steamladder.getLadder("playtime", CountryCode).then((data) => {
        localdata = data.ladder[PlayTime_Rank].steam_stats.games.total_playtime_min-dataa.steam_stats.games.total_playtime_min
        stats.PlayTime_Rank = (localdata / 60)
      });
    } else {
      steamladder.getLadder("playtime", CountryCode).then((data) => {
        localdata = data.ladder[99].steam_stats.games.total_playtime_min-dataa.steam_stats.games.total_playtime_min
        stats.PlayTime_Rank = (localdata / 60)
      });
    }

    if (XP_Rank != '(UNKNOWN)') {
      steamladder.getLadder("xp", CountryCode).then((data) => {
        stats.XP_Rank = data.ladder[XP_Rank].steam_stats.level-dataa.steam_stats.level
      });
    } else {
      steamladder.getLadder("xp", CountryCode).then((data) => {
        stats.XP_Rank = data.ladder[99].steam_stats.level-dataa.steam_stats.level
      });
    }

    if (Games_Rank != '(UNKNOWN)') {
      steamladder.getLadder("games", CountryCode).then((data) => {
        stats.Games_Rank = data.ladder[Games_Rank].steam_stats.games.total_games-dataa.steam_stats.games.total_games
      });
    } else {
      steamladder.getLadder("games", CountryCode).then((data) => {
        stats.Games_Rank = data.ladder[99].steam_stats.games.total_games-dataa.steam_stats.games.total_games
      });
    }

 let time = (dataa.steam_stats.games.total_playtime_min/60)
    setTimeout(function(){
      const exampleEmbed = new MessageEmbed()
      .setColor(Config.Bot.color)
      .setAuthor({ name: dataa.steam_user.steam_name+'`s SteamLadder Stats', iconURL: dataa.steam_user.steam_avatar_src, url: dataa.steam_user.steamladder_url })
      .addFields(
        { name: 'Account Level', value: 'Your Rank: '+dataa.ladder_rank.country.country_xp+'\nYour Level: '+dataa.steam_stats.level+'\nUntill Next Rank: '+stats.XP_Rank},
        { name: 'Account PlayTime (Hours)', value: 'Your Rank: '+dataa.ladder_rank.country.country_playtime+'\nYour PlayTime: '+Math.round(time)+'h\nUntill Next Rank: '+stats.PlayTime_Rank+'h'},
        { name: 'Account Games Amount', value: 'Your Rank: '+dataa.ladder_rank.country.country_games+'\nTotal Games Owned: '+dataa.steam_stats.games.total_games+'\nUntill Next Rank: '+stats.Games_Rank},
      )
      .setTimestamp()

      interaction.reply({ embeds: [exampleEmbed] });
    }, 1000);

  })
  .catch(function (error) {
      console.log(error);
  });

  },
  
};