const Permissions = require('eris').Constants.Permissions;

//TODO: Get number of deleted somehow
//TODO: Clean them / mute case sensitivity
//TODO: Clean them / mute nicknames
//TODO: Should userIDs override the rest of the permissions? I think so - ALL OF THIS NEEDS TO BE FIXED
//TODO: Serverwide mute?

bot.registerCommand('mute', (msg, args) => {
    if(args.length === 0) return 'Please supply a user to mute';

    let toFind = bot.users.find(u => u.username === args[0]);
    if(!toFind) return 'Please supply a valid user';

    bot.editChannelPermissions(msg.channel.id, msg.author.id, 0, Permissions.sendMessages);
}, {
    description: 'Mutes a user',
    fullDescription: 'Mutes a user so they will not be able to send messages in their current channel',
    usage: '<number to search through>',
    requirements: {
        permissions: {
            "manageMessages": true
        }
    }
});

let clean = bot.registerCommand('clean', (msg, args) => {
    let toDelete = parseInt(args.length > 0 ? args[0] : 10);
    if(!toDelete) return 'Please supply a valid number';

    bot.purgeChannel(msg.channel.id, toDelete + 1).then(del => {
        bot.createMessage(msg.channel.id, `${del - 1} messages deleted`).then(msg => {
            setTimeout(() => bot.deleteMessage(msg.channel.id, msg.id), 4000);
        });
    });
}, {
    description: 'Deletes messages',
    fullDescription: 'The bot will delete messages from all users in the last specified number of messages',
    usage: '<number to search through>',
    requirements: {
        permissions: {
            "manageMessages": true
        }
    }
});

clean.registerSubcommand('you', (msg, args) => {
    let toDelete = parseInt(args.length > 0 ? args[0] : 10);
    if(!toDelete) return 'Please supply a valid number';

    bot.purgeChannel(msg.channel.id, toDelete + 1, (logMsg) => {
        if(logMsg.author.id === bot.user.id) return true;
    }).then(del => {
        bot.createMessage(msg.channel.id, `${del - 1} messages deleted`).then(msg => {
            setTimeout(() => bot.deleteMessage(msg.channel.id, msg.id), 4000);
        });
    });
}, {
    description: 'Delete bot\'s messages',
    fullDescription: 'The bot will delete messages from himself in the last specified number of messages',
    usage: '<number to search through>'
});

clean.registerSubcommand('me', (msg, args) => {
    let toDelete = parseInt(args.length > 0 ? args[0] : 10);
    if(!toDelete) return 'Please supply a valid number';

    bot.purgeChannel(msg.channel.id, toDelete + 1, (logMsg) => {
        if(logMsg.author.id === msg.author.id) return true;
    }).then(del => {
        bot.createMessage(msg.channel.id, `${del - 1} messages deleted`).then(msg => {
            setTimeout(() => bot.deleteMessage(msg.channel.id, msg.id), 4000);
        });
    });
}, {
    description: 'Deletes your messages',
    fullDescription: 'The bot will delete messages from you in the last specified number of messages',
    usage: '<number to search through>'
});

clean.registerSubcommand('them', (msg, args) => {
    if(args.length < 1) return 'Please supply a user';

    let toFind = bot.users.find(u => u.username === args[0]);
    if(!toFind) return 'Please supply a valid user';

    let toDelete = parseInt(args.length > 1 ? args[1] : 10);
    if(!toDelete) return 'Please supply a valid number';

    bot.purgeChannel(msg.channel.id, toDelete + 1, (logMsg) => {
        if(logMsg.author.id === toFind.id) return true;
    }).then(del => {
        bot.createMessage(msg.channel.id, `${del - 1} messages deleted`).then(msg => {
            setTimeout(() => bot.deleteMessage(msg.channel.id, msg.id), 4000);
        });
    });
}, {
    description: 'Deletes messages by a single user',
    fullDescription: 'The bot will delete messages from a user in the last specified number of messages',
    usage: '<user name **not a nickname**> <number to search through>',
    requirements: {
        permissions: {
            "manageMessages": true
        }
    }
});