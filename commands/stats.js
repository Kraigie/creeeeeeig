bot.registerCommand('uptime', (msg, args) => {
    let totalSeconds = process.uptime();

    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    bot.createMessage(msg.channel.id, `\`${days} days, ${hours} hrs, ${minutes} min, ${seconds} sec\``);
}, {
    description: 'Check my uptime',
    fullDescription: 'The bot will reply with the amount of time it has been available'
});
