const Discord = require('discord.js');
const { owner } = require('../config.json');

module.exports = {
    name: "say",
    description: "Let the bot speak on your behalf",
    run: async (client, message, args) => {
        message.delete();
        if (message.member.id !== owner) {
            return message.reply("you can't do that!")
        }

        if (typeof args[0] == 'undefined') {
            return message.channel.send("Maybe include something :wink:")
        }

        //const chnl = await filter_integer(message, args[0]);

        const channel = message.client.channels.cache.find(channel => channel.id === args[0]);

        if (!channel) {
            if (args[0].toLowerCase() === "embed") {
                const embed = new Discord.MessageEmbed()
                    .setDescription(args.slice(1).join(" "))
                    .setColor('RANDOM');

                message.channel.send(embed);
            } else {
                message.channel.send(args.slice(0).join(" "));
            }
        } else {
            if (args[1].toLowerCase() === "embed") {
                const embed = new Discord.MessageEmbed()
                    .setDescription(args.slice(2).join(" "))
                    .setColor('RANDOM');

                channel.send(embed);
            } else {
                channel.send(args.slice(1).join(" "));
            }
        }
    }
}