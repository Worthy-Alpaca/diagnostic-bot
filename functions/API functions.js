const { sign_token, error_handler } = require('./functions');
const fetch = require('node-fetch');

module.exports = {
    get_API_call: function (message, api_section = '', type = '', payload, extra_payload) {
        return new Promise(async function (resolve, reject) {
            const token = sign_token(message.guild.id);
            //console.log(token)
            const response = await fetch(process.env.API_ADDRESS + `/diagnostics/${api_section}/?guildID=${message.guild.id}&payload=${payload}&extraPayload=${extra_payload}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': token,
                    'type': type,
                }
            }).then(function (response) {
                return response.json();
            }).catch(error => {
                return error_handler(error);
            })

            if (typeof response == 'undefined') {
                return resolve(false);
            } else if (typeof response.status == 'undefined') {
                return resolve(response);
            } else if (response.status === 200 && response.success === false) {
                return resolve(response);
            } else {
                message.reply(`An error has occured: ${response.err}`);
            }


        })
    },

    post_API_call: function (api_section = '', payload, guild, type = '') {
        return new Promise(function (resolve, reject) {
            const token = sign_token(guild.id);
            //console.log(token)
            const response = fetch(process.env.API_ADDRESS + `/diagnostics/${api_section}/?guildID=${guild.id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'auth-token': token,
                    'type': type,
                },
                body: payload
            }).then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 409) {
                    return response.json();
                }
            }).catch(error => {
                return error_handler(error);
            })

            return resolve(response);
        })
    }

}