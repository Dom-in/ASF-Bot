const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const config = require('../../config.json');
var mysql = require('mysql');
const fetch = require('node-fetch')
const { SteamLadderAPI } = require("steamladder");
const Config = require('../../config.json')
const steamladder = new SteamLadderAPI(Config.SteamLadder.API);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boardstats")
    .setDescription("Check stats of your profile on SteamLadder"),
    //.addStringOption(option =>
      //option.setName('steam_id')
        //.setDescription('Your steam id 64')
        //.setRequired(true)),
  run: async (interaction) => {
    
    let stats = {
      XP_Rank : 0,
      PlayTime_Rank : 0,
      Games_Rank : 0
    }

    let steamid = Config.SteamLadder.MainBot//interaction.options.getString('steam_id');
    let dataa = await steamladder.getProfile(steamid)
    let XP_Rank = dataa.ladder_rank.country.country_xp-1 //Done
    let PlayTime_Rank = dataa.ladder_rank.country.country_playtime-1 //Done
    let Games_Rank = dataa.ladder_rank.country.country_games-1 //Done

    if (XP_Rank >= 99) { XP_Rank = '(UNKNOWN)' };
    if (PlayTime_Rank >= 99) { PlayTime_Rank = '(UNKNOWN)' };
    if (Games_Rank >= 99) { Games_Rank = '(UNKNOWN)' };

    if (PlayTime_Rank != '(UNKNOWN)') {
      steamladder.getLadder("playtime", "PL").then((data) => {
        localdata = data.ladder[PlayTime_Rank].steam_stats.games.total_playtime_min-dataa.steam_stats.games.total_playtime_min
        stats.PlayTime_Rank = (localdata / 60)
      });
    } else {
      steamladder.getLadder("playtime", "PL").then((data) => {
        localdata = data.ladder[99].steam_stats.games.total_playtime_min-dataa.steam_stats.games.total_playtime_min
        stats.PlayTime_Rank = (localdata / 60)
      });
    }

    if (XP_Rank != '(UNKNOWN)') {
      steamladder.getLadder("xp", "PL").then((data) => {
        stats.XP_Rank = data.ladder[XP_Rank].steam_stats.level-dataa.steam_stats.level
      });
    } else {
      steamladder.getLadder("xp", "PL").then((data) => {
        stats.XP_Rank = data.ladder[99].steam_stats.level-dataa.steam_stats.level
      });
    }

    if (Games_Rank != '(UNKNOWN)') {
      steamladder.getLadder("games", "PL").then((data) => {
        stats.Games_Rank = data.ladder[Games_Rank].steam_stats.games.total_games-dataa.steam_stats.games.total_games
      });
    } else {
      steamladder.getLadder("games", "PL").then((data) => {
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

  },
};