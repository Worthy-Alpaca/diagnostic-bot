const { delete_API_call } = require('../functions/API functions');
const Discord = require('discord.js');
const { owner } = require('../config.json');

module.exports = {
    name: "reset-db",
    description: "Resets the statistics",
    run: async (client, message, args) => {
        console.log(message.member.id)
        if (message.member.id !== owner) {
            return message.reply("you can't do that!")
        }

        const payload = JSON.stringify({
            'channel': process.env.CHECKCHANNEL
        })
        const embed = new Discord.MessageEmbed()

        const done = await delete_API_call('delete', payload, message.guild, 'statistics');

        if (done.success === true) {
            embed.setColor("GREEN").setDescription("✅ Reset complete");
            return message.channel.send(embed);
        } else if (done.success === false && done.status === 200) {
            embed.setColor("YELLOW").setDescription("❗ No statistics yet");
            return message.channel.send(embed);
        } else {
            embed.setColor("RED").setDescription(`❗ An error occured: ${done.err}`);
            return message.channel.send(embed);
        }
    }
}