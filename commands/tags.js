const TagManager = require('../classes/tagmanager.js');

let tags = new TagManager();

let tag = bot.registerCommand('tag', (msg, args) => {
    if(args.length === 0) return 'Please supply a tag';

    tags.getTag({tag: args.join(' ')}, msg.memeber.server.id).then(content => {
        bot.createMessage(msg.channel.id, content);
    }).catch(() => {
        bot.createMessage(msg.channel.id, 'There was an error retrieving your tag');
    });
}, {
    description: 'Get a tag',
    fullDescription: 'The bot will retrieve a tag from your server'
});

tag.registerSubcommand('you', (msg, args) => {
    let toDelete = parseInt(args.length > 0 ? args[0] : 10);
    if(!toDelete) return 'Please supply a valid number';

    bot.deleteMessage(msg.channel.id, msg.id);

    bot.purgeChannel(msg.channel.id, toDelete, (logMsg) => {
        if(logMsg.author.id === bot.user.id) return true;
    });
}, {
    description: 'Delete bot\'s messages',
    fullDescription: 'The bot will delete messages from himself in the last specified number of messages',
    usage: '<number to search through>'
});