const ora = require('ora')
const fs = require('fs')
const { MessageButton, MessageEmbed, Client, MessageActionRow, Modal, Collection, TextInputComponent } = require('discord.js')
const slash = require('./src/util/slash')
const intentsLoader = ora('Registering Intents').start()
const client = new Client({
    intents: ["GUILDS", "GUILDS","GUILD_MEMBERS","GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"]
});
const config = require('./config.json')

client.commands = new Collection()

const events = fs
  .readdirSync('./src/events')
  .filter(file => file.endsWith('.js'))

events.forEach(event => {
  const eventFile = require(`./src/events/${event}`)
  if (eventFile.oneTime) {
    client.once(eventFile.event, (...args) => eventFile.run(...args))
  } else {
    client.on(eventFile.event, (...args) => eventFile.run(...args))
  }
})

process.on('exit', () => {
  console.log('Stopping ASF Discord Bot!')
})

client.login(config.Bot.token)
