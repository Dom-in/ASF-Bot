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
    "bot" : {
        "token" : "Here you put you're discord bot's token",
        "prefix" : "Here you put you're discord bot's prefix you want to use"
    },
    "secruity" : {
        "UID": "Here you put you're discord's User ID so only you can execute commands",
        "IP" : "Here you put you're ASF panel IP:PORT",
        "ASF_PASSWORD" : "Here you put you're ASF password"
    }
}
```

Once the bot has started and connected to the ASF instance, you can send commands through your discord servers where youre bot. 
The bot also allows to redeem steam keys. It will automatically parse every key and activate them on your accounts with ```!redeem {ACCOUNT} {KEYS_HERE}``` notifying you the process.
