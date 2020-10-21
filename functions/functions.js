const { owner } = require('../config.json');
const jwt = require('jsonwebtoken');
const Discord = require('discord.js');
const client = require('../client');
const fetch = require('node-fetch');

module.exports = {
    sign_token: function (id) {
        return jwt.sign({ _id: id }, process.env.TOKEN_SECRET);
    },

    error_handler: function (error) {

        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle('An Error Occured')
            .setDescription(error.code)
            .addField(`\u200b`, `**Type:** ${error.type}
            **Message:** ${error.message}`);

        client.users.fetch(owner, false).then(user => {
            return user.send(embed);
        });
    },

    dadjoke: async function (message) {
        const result = await fetch('https://icanhazdadjoke.com/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => {
            return res.json();
        })

        return message.reply(result.joke);
    }
}