const ytdl = require('ytdl-core');

bot.registerCommand('join', (msg, args) => {
    bot.joinVoiceChannel(msg.member.channelID)
    .then(conn => {
        conn.playRawStream(ytdl('https://www.youtube.com/watch?v=eVTXPUF4Oz4', {filter: 'audioonly'}))
    })
    .catch(err => console.log(err));
    }, {
        description: 'Make me join your voice channel',
        fullDescription: 'The bot will attempt to join your voice channel'
    });
