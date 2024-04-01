const { REST, Routes } = require('discord.js');
const config = require('./configs/config.json');
const fs = require('fs');

const rest = new REST({ version: '10' }).setToken(config.client.token);

// Read the JSON file
fs.readFile('./configs/commands.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        process.exit(1);
    }

    // Parse the JSON data into a JavaScript object
    const commands = JSON.parse(data);

    // Use the commands in the rest.put() call
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
});