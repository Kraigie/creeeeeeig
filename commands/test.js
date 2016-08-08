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
