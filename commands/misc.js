const auth = require('../auth');
const request = require('request');

bot.registerCommand('ping', (msg, args) => {
    bot.createMessage(msg.channel.id, 'pong').
    then(newMsg => {
        bot.editMessage(newMsg.channel.id, newMsg.id, `\`\`\`javascript\npong | Time taken: ${newMsg.timestamp - msg.timestamp} ms\`\`\``);
    });
}, {
    description: 'Ping me to make sure I\'m alive',
    fullDescription: 'The bot will reply with the amount of time taken'
});

bot.registerCommand('avi', (msg, args) => {
    if(args.length == 0 || msg.mentions.length == 0) return 'Please specify a user by mentioning them';

    let users = msg.channel.guild.members;
    let count = 0;
    let retStr = `Requested by: **${msg.author.username}**\n`;

    msg.mentions.forEach(userid => {
        let member = users.find(m => {
            return (m.id === userid && m.user.avatar);
        });

        if(member) {
            retStr += `https://discordapp.com/api/users/${member.id}/avatars/${member.user.avatar}.jpg\n`
            count++;
        }
    });

    if(count < msg.mentions.length) retStr += `\`Could not find avatar for ${msg.mentions.length - count} mentioned user(s)\``;

    return retStr;
}, {
    description: 'Get peoples avatars',
    fullDescription: 'The bot will reply with the avatar of the specified users',
    usage: '<space separated mentions>'
});

bot.registerCommand('weather', (msg, args) => {
    if(args.length == 0) return "Please specify a location";

    let options = {
        uri: 'http://api.openweathermap.org/data/2.5/weather',
        qs: {
            APPID: auth.weather_key,
            q: args.join()
        },
        json: true
    }

    request(options, (err, resp, body) => {
        if (err) {
            console.log(`Error getting weathers: ${err}`);
            return `${msg.author.mention}, your weather request could not be completed`;
        }

        if (body.cod !== 200 || !body.main)
            return `${msg.author.mention}, your location could not be found`

        let temp = body.main.temp;
        temp = (temp - 273.15) * 1.8000 + 32.00;

        let retStr = '';
        if (temp > 75) retStr += ':fire:';
        else if (temp > 45) retStr += ':leaves:';
        else retStr += ':snowman:';

        retStr += ` \`${body.name}\` | Temp: ${temp.toFixed(1)}°F `;

        for (let w of body.weather) {
            if (w.main === 'Rain' || w.main === 'Drizzle') retStr += ':cloud_rain:';
            if (w.main === 'Thunderstorm') retStr += ':thunder_cloud_rain:';
            if (w.main === 'Clear') retStr += ':sunny:';
            if (w.main === 'Snow') retStr += ':snowflake:';
            if (w.main === 'Atmosphere') retStr += ':fireworks:';
            if (w.main === 'Additional') retStr += ':dash:';
            if (w.main === 'Clouds') retStr += ':cloud:';
            if (w.main === 'Extreme') retStr += ':skull::cloud_tornado::ocean:'; //lol
        }

        bot.createMessage(msg.channel.id, retStr);
    });
}, {
    description: 'Get the weather',
    fullDescription: 'The bot will get the weather for a specified location',
    usage: '<city>,<state/country>'
});
