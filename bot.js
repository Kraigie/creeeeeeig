const Eris = require('eris');
const auth = require('./auth');

bot = new Eris.CommandClient(auth.token, {}, {
    description: 'Friendly Neighborhood Discord Bot - built using Eris',
    prefix: '.',
    ignoreBots: false,
    owner: 'Kraigie'
});

register = require('./commands/misc');

bot.on("ready", () => {
    console.log("Ready!");

});

bot.connect();
