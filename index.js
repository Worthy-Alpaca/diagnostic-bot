const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();
const checkprefix = "!";
const prefix = "?";
const API = require('./functions/API functions');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commands = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
// Loop over the commands, and add all of them to a collection
// If there's no name found, prevent it from returning an error
for (let file of commands) {
    const command = require(`./commands/${file}`);
    // Check if the command has both a name and a description
    if (command.name && command.description) {

        client.commands.set(command.name, command);

    } else {
        console.log("A file is missing something")
    }

    // check if there is an alias and if that alias is an array
    if (command.aliases && Array.isArray(command.aliases))
        command.aliases.forEach(alias => client.aliases.set(alias, command.name));
};

client.on('ready', () => {
    console.log("I'm ready and diagnosing");

    client.user.setPresence({
        status: "online",
        activity: {
            name: `your chatter`,
            type: "LISTENING"
        }
    });
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.startsWith(checkprefix)) {
        if (message.channel.id !== process.env.CHECKCHANNEL) return;
        const cnt = Array.from(message.content);
        const payload = JSON.stringify({
            'channel': message.channel.id,
            'counter': cnt.length
        })

        await API.post_API_call('post', payload, message.guild, 'diagnostics');
    }

    if (message.mentions.has(client.user)) {
        return message.reply(`I only have one command, \`${prefix}statistic\``);
    }

    if (!message.content.startsWith(prefix)) {
        return;
    }    
    // slice off the prefix and convert the rest of the message into an array
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    // convert all arguments to lowercase
    const cmd = args.shift().toLowerCase();
    // check if there is a message after the prefix
    if (cmd.length === 0) return;
    // look for the specified command in the collection of commands
    let command = client.commands.get(cmd);
    // If no command is found check the aliases
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    // if there is no command we return with an error message
    if (!command) return message.reply(`\`${prefix + cmd}\` doesn't exist!`);
    // finally run the command
    command.run(client, message, args);
})

client.login(process.env.TOKEN);