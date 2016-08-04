const Player = require('../classes/player');
const YtSong = require('../classes/ytsong');
const ScSong = require('../classes/scsong');
const util = require('./meta/util');

let players = {};

bot.registerCommand('join', (msg, args) => {
    let server = msg.member.guild.id;

    if(!msg.member.voiceState || !msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(players[server] && players[server].playing) return 'I\'m playing something in a different voice channel';

    bot.joinVoiceChannel(msg.member.voiceState.channelID)
    .then(conn => {
        players[server] = new Player(conn, msg.channel);
    })
    .catch(err => {
        console.log(`Error joining voice channel: ${err.stack}`);
        return 'There was an error joining your voice channel';
    });
}, {
    description: 'Make me join your voice channel',
    fullDescription: 'The bot will attempt to join your voice channel'
});

bot.registerCommand('leave', (msg, args) => {
    let server = msg.member.guild.id;

    if(!players[server]) return 'I\'m not in a voice channel';

    bot.leaveVoiceChannel(players[server].channel);
    players[server] = null;
}, {
    description: 'Make me leave my voice channel',
    fullDescription: 'The bot will attempt to leave its current voice channel'
});

bot.registerCommand('queue', (msg, args) => {
    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!players[server]) return 'I\'m not in a voice channel'; //TODO: Allow the bot to change voice channels

    return players[server].queueString;
}, {
    description: 'See what\'s in the queue',
    fullDescription: 'The bot will print out a list of currently queued songs'
});

bot.registerCommand('skip', (msg, args) => {
    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!players[server]) return 'I\'m not in a voice channel';

    players[server].skip();
    return 'Song was skipped';
}, {
    description: 'Skip the current song',
    fullDescription: 'Skips to the next song or stops playing if the queue is empty'
});

bot.registerCommand('play', (msg, args) => {
    if(args.length === 0) return 'Please supply some form of song';

    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!players[server]) return 'I\'m not in a voice channel';

    let type = util.getSource(args.join(' '));
    if(!type) return 'You didn\'t supply a valid song';

    util.getLink(args.join(' '), type === 'query').then(link => {
        let song = {};
        if(type === 'sc') {
            song = new ScSong(link, msg.member.nick || msg.member.user.username, 'sc');
        } else {
            song = new YtSong(link, msg.member.nick || msg.member.user.username, 'yt');
        }

        song.getInfo().then(song => {
            players[server].addSong(song);
        })
        .catch(err => {
            console.log(`Error getting song: ${err.stack}`);
            bot.createMessage(msg.channel.id, 'There was an error adding your song to the queue');
        });
    })
    .catch(err => {
        console.log(`Error querying youtube for song: ${err.stack}`);
        bot.createMessage(msg.channel.id, `I wasn't able to find any information on your song`);
    });

}, {
    description: 'Make me play a song',
    fullDescription: 'The bot will attempt to join your voice channel',
    usage: '<youtube url> or <soundcloud url> or <youtube search>'
});
