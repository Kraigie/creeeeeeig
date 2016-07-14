const config = require('../config');

//TODO: Get number of deleted somehow
//TODO: Get the purge command fixed so it deletes the proper amount
//TODO: Clean them case sensitivity
//TODO: Clean them nicknames
//TODO: Should userIDs override the rest of the permissions? I think so

bot.registerCommand('mute', (msg, args) => {
    if(args.length === 0) return 'Please supply a user to mute';

    let toFind = bot.users.find(u => u.username === args[0]);
    if(!toFind) return 'Please supply a valid user';

    bot.editChannelPermissions(msg.channel.id, msg.author.id, 0, 2048);
}, {
    description: 'Deletes messages',
    fullDescription: 'The bot will delete messages from all users in the last specified number of messages',
    usage: '<number to search through>',
    requirements: {
        userIDs: [config.evalid],
        permissions: {
            "manageMessages": true
        }
    }
});

let clean = bot.registerCommand('clean', (msg, args) => {
    if(args.length === 0) return 'Please supply a number of messages';

    let toDelete = parseInt(args[0]);
    if(!toDelete) return 'Please supply a valid number';

    bot.deleteMessage(msg.channel.id, msg.id);

    bot.purgeChannel(msg.channel.id, toDelete);
}, {
    description: 'Deletes messages',
    fullDescription: 'The bot will delete messages from all users in the last specified number of messages',
    usage: '<number to search through>',
    requirements: {
        userIDs: [config.evalid],
        permissions: {
            "manageMessages": true
        }
    }
});

clean.registerSubcommand('you', (msg, args) => {
    if(args.length === 0) return 'Please supply a number of messages';

    let toDelete = parseInt(args[0]);
    if(!toDelete) return 'Please supply a valid number';

    bot.deleteMessage(msg.channel.id, msg.id);

    bot.purgeChannel(msg.channel.id, toDelete, (logMsg) => {
        if(logMsg.author.id === bot.user.id) return true;
    });
}, {
    description: 'Delete bot\'s messages',
    fullDescription: 'The bot will delete messages from himself in the last specified number of messages',
    usage: '<number to search through>',
    requirements: {
        userIDs: [config.evalid]
    }
});

clean.registerSubcommand('me', (msg, args) => {
    if(args.length === 0) return 'Please supply a number of messages';

    let toDelete = parseInt(args[0]);
    if(!toDelete) return 'Please supply a valid number';

    bot.deleteMessage(msg.channel.id, msg.id);

    bot.purgeChannel(msg.channel.id, toDelete, (logMsg) => {
        if(logMsg.author.id === msg.author.id) return true;
    });
}, {
    description: 'Deletes your messages',
    fullDescription: 'The bot will delete messages from you in the last specified number of messages',
    usage: '<number to search through>',
    requirements: {
        userIDs: [config.evalid]
    }
});

clean.registerSubcommand('them', (msg, args) => {
    if(args.length === 0) return 'Please supply a user and a number of messages';

    let toFind = bot.users.find(u => u.username === args[0]);
    if(!toFind) return 'Please supply a valid user';

    let toDelete = parseInt(args[1]);
    if(!toDelete) return 'Please supply a valid number';

    bot.deleteMessage(msg.channel.id, msg.id);

    bot.purgeChannel(msg.channel.id, toDelete, (logMsg) => {
        if(logMsg.author.id === toFind.id) return true;
    });
}, {
    description: 'Deletes messages by a single user',
    fullDescription: 'The bot will delete messages from a user in the last specified number of messages',
    usage: '<user name **not a nickname**> <number to search through>',
    requirements: {
        userIDs: [config.evalid],
        permissions: {
            "manageMessages": true
        }
    }
});