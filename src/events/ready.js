
const ora = require("ora");
const fs = require("fs");
const axios = require('axios');
// Slash Commands
const slash = require("../util/slash");

// CLI
const botLoader = ora("Starting Discord.js Client").start();

module.exports = {
  event: "ready", // Name of the event
  oneTime: true, // If set to true the event will only be fired once until the client is restarted
  run: async (client) => {
    const commandFiles = fs
      .readdirSync("./src/commands")
      .filter((file) => file.endsWith(".js"));

    let commandsArray = [];
    commandFiles.forEach((file) => {
      const command = require(`../commands/${file}`);
      client.commands.set(command.data.name, command);

      commandsArray.push(command);
    });

    const finalArray = commandsArray.map((e) => e.data.toJSON());
    slash.register(client.user.id, finalArray);
    botLoader.succeed(`${client.user.tag} ready for work!`);

    client.user.setActivity('Your Steam Cards', {
      type: "WATCHING",
    });
  },
};