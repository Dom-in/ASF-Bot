# ASF-Bot

### Discord Bot coded in JavaScript to control your ASF instance.
Control your ASF instance by discord.

ASF-Bot support server:<br>
[![Discord](https://img.shields.io/discord/902138867199643679?color=7289da&label=Discord&logo=discord&logoColor=ffffff)](https://discord.gg/m2jM5zGKCk)<br>
ASF support server:<br>
[![Discord](https://img.shields.io/discord/267292556709068800.svg?label=Discord&logo=discord&cacheSeconds=3600)](https://discord.gg/hSQgt8j)

## Usage:
So to start you have to configure youre config.json file
```
{
    "client" : {
        "token" : "Bot token",
        "prefix" : "Bot prefix",
        "ID" : "Bot ID"
    },
    "secruity" : {
        "USER_ID": "Your own user id",
        "GUILD_ID": "The Guild ID you want to use the Bot at",
        "IP" : "Here you put your ASF panel IP:PORT",
        "IPC_PASSWORD" : "Here you put your ASF IPC password"
    },
    "fsbot" : {
        "ID": "1041398379667804193",
        "CHANNEL_ID": "FreeStuff Bot channel ID"
    }
}
```

Run run.js for the Bot to start.
Once the slash commands are registered and the bot has started and connected to the ASF instance, you can send commands through your Discord server.
The bot also allows you to redeem Steam keys. It will automatically parse each key and activate them on your accounts, notifying you along the way with ```{prefix}redeem {ACCOUNT} {KEYS_HERE}```.
