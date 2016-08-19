const MultiGuildPlayer = require('../node_modules/discord-playlist/discord-playlist').MultiGuildPlayer;
const auth = require('../auth');

let MGP = new MultiGuildPlayer({sc_key: auth.sc_key, yt_key: auth.yt_key, emitPlaylistAdd: false, voiceMod: .7},'eris');
MGP.on('error', msg => {
    bot.createMessage(msg.channelID, 'Sorry, I couldn\'t find your song or something like that');
});
MGP.on('songAdded', msg => {
    bot.createMessage(msg.channelID, `Your song was added to the queue in position ${msg.position}`);
});
MGP.on('songStart', msg => {
    console.log(msg);
    bot.createMessage(msg.channelID, `:headphones: ${msg.playing.getInfoString()}`);
});
MGP.on('queueEmpty', msg => {
    console.log(msg);
    bot.createMessage(msg.channelID, 'The queue is now empty');
});

let prettyPrintQueue = (songs) => {
    let retStr = '```xl\n';
    let num = 1;
    for(let s of songs) {
        retStr += `${num++}.] ${s.getInfoString()}\n`;
    }
    retStr += '```';
    return retStr;
};

bot.registerCommand('volume', (msg, args) => {
    let server = msg.member.guild.id;

    //TODO: Check to see if they're in the correct voice channel?
    if(!msg.member.voiceState || !msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!MGP.connectionExists(server)) return 'I\'m not in a voice channel';

    if(args.length === 0) return 'Please supply a volume';

    MGP.setVolume(server, args[0]);
}, {
    description: 'Change the volume of the bot',
    fullDescription: 'The bot will change the it\'s volume',
    usage: '<volume configured on a 0-100 scale>' //TODO: This could use some explanation
});

bot.registerCommand('join', (msg, args) => {
    let server = msg.member.guild.id;

    if(!msg.member.voiceState || !msg.member.voiceState.channelID) return 'You\'re not in a voice channel';

    if(MGP.connectionExists(server) || MGP.isPlaying(server)) return 'I\'m already playing something or in a different voice channel';

    bot.joinVoiceChannel(msg.member.voiceState.channelID)
    .then(conn => {
        MGP.addConnection(conn, msg.channel.id, server);
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

    if(!MGP.connectionExists(server)) return 'I\'m not in a voice channel';

    MGP.kill(server);
    bot.leaveVoiceChannel(msg.channel.id);
}, {
    description: 'Make me leave my voice channel',
    fullDescription: 'The bot will attempt to leave its current voice channel'
});

bot.registerCommand('queue', (msg, args) => {
    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!MGP.connectionExists(server)) return 'I\'m not in a voice channel'; //TODO: Allow the bot to change voice channels

    if(MGP.length(server) === 0) return '\`The queue is empty\`';

    let songs = MGP.getQueue(server);
    return prettyPrintQueue(songs);
}, {
    description: 'See what\'s in the queue',
    fullDescription: 'The bot will print out a list of currently queued songs'
});

bot.registerCommand('skip', (msg, args) => {
    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!MGP.connectionExists(server)) return 'I\'m not in a voice channel';
    if(MGP.isPlaying(server)) {
        MGP.skip(server);
        return 'Song was skipped';
    }
}, {
    description: 'Skip the current song',
    fullDescription: 'Skips to the next song or stops playing if the queue is empty'
});

bot.registerCommand('play', (msg, args) => {
    if(args.length === 0) return 'Please supply some form of song';

    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!MGP.connectionExists(server)) return 'I\'m not in a voice channel';

    MGP.addSong(server, args.join(' '), msg.member.nick || msg.member.user.username);
}, {
    description: 'Make me play a song',
    fullDescription: 'The bot will play a song from soundcloud or youtube',
    usage: '<youtube url> or <soundcloud url> or <youtube search>'
});

bot.registerCommand('playlist', (msg, args) => { //TODO: Tell how many songs were added to the queue, list subcommand of play?
    if(args.length === 0) return 'Please supply some form of song';

    let server = msg.member.guild.id;

    if(!msg.member.voiceState.channelID) return 'You\'re not in a voice channel';
    if(!MGP.connectionExists(server)) return 'I\'m not in a voice channel';

    MGP.addPlaylist(server, args.join(' '));
}, {
    description: 'Make me play a playlist',
    fullDescription: 'The bot will attempt to play a playlist',
    usage: '<youtube playlist link> or <soundcloud playlist link>'
});
