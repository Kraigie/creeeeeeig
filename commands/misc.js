bot.registerCommand('ping', (msg, args) => { // Make an echo command
    bot.createMessage(msg.channel.id, 'pong').
    then(newMsg => {
        bot.editMessage(newMsg.channel.id, newMsg.id, `\`\`\`javascript\npong | Time taken: ${newMsg.timestamp - msg.timestamp} ms\`\`\``);
    });
}, {
    description: 'Ping me to make sure I\'m alive',
    fullDescription: 'The bot will reply with the amount of time taken'
});
