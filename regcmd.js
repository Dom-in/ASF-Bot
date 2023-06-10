const { REST, Routes } = require('discord.js');
const config = require('./configs/config.json');

//const RconCommandsUse = ['redeem', 'addlicense', 'pause', 'stop', 'start', 'resume', 'restart', 'update', 'play', 'commands', 'version', 'balance', 'stats'];

const commands = [
    {
        name: 'ping',
        description: 'pong!',
    },
    {
        name: 'asf',
        description: 'list all ASF commands!',
    },
    {
        name: 'version',
        description: 'Bot-version!',
    }
];

const rest = new REST({ version: '10' }).setToken(config.client.token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                config.client.ID,
                config.secruity.GUILD_ID
            ),
            { body: commands }
        );
        process.exit(0);

    } catch (error) {
        console.error(`${error}`)
        process.exit(1);
    }
})();