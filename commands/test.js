bot.registerCommand('testx', (msg, args) => {
    return 'hi';

}, {
    description: 'Test things',
    fullDescription: 'TEEEEESSSSSSSSSSTTTTTTTTTTTtt',
    requirements: {
        permissions: {
            "manageMessages" : true
        }
    }
});

bot.registerCommand('test', (msg, args) => {
    bot.joinVoiceChannel(msg.member.voiceState.channelID)
    .then(conn => {
        conn.playFile('test.mp3');
        conn.setVolume(.5);
    });

}, {
    description: 'Test things',
    fullDescription: 'TEEEEESSSSSSSSSSTTTTTTTTTTTtt'
});

bot.registerCommand('test2', (msg, args) => {
    bot.joinVoiceChannel(msg.member.voiceState.channelID)
    .then(conn => {
        conn.playFile('test2.mp3');
        conn.setVolume(.5);
    });

}, {
    description: 'Test things',
    fullDescription: 'TEEEEESSSSSSSSSSTTTTTTTTTTTtt'
});








