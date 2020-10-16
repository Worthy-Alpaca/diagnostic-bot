const { get_API_call } = require('../functions/API functions');
const Discord = require('discord.js');

module.exports = {
    name: "statistic",
    description: "Returns the statistics",
    run: async (client, message, args) => {

        const statistics = await get_API_call(message, 'get', 'statistic', process.env.CHECKCHANNEL);
        
        if (statistics === false) {
            return message.reply("it appears the API is currently unavailable. Please try again at a later date")
        }
        if (typeof messages_count == 'undefined') {
            const embed = new Discord.MessageEmbed()
                .setColor("YELLOW")
                .setDescription("❗ No statistics yet");
            return message.reply(embed);
        }

        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("RANDOM")
            .setThumbnail(message.guild.iconURL())
            .setFooter(message.guild.name)
            .setTitle("**Statistics**")
            .setDescription(`There have been \`${statistics[0].messages_count}\` messages with a total of \`${statistics[0].character_count}\` characters.
            Thats about \`${statistics[0].character_count / statistics[0].messages_count}\` characters per message`);

        return message.reply(embed);
    }
}