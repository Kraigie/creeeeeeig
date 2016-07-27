const TagManager = require('../classes/tagmanager.js');

let tags = new TagManager();

bot.registerCommand('taglist', (msg, args) => {
    tags.getAllTag(msg.member.server.id).then(content => {
        bot.createMessage(msg.channel.id, content);
    }).catch(() => {
        bot.createMessage(msg.channel.id, 'There was an error retrieving the tags');
    });
});

let tag = bot.registerCommand('tag', (msg, args) => {
    if(args.length === 0) return 'Please supply a tag';

    tags.getTag({
        tag: args.join(' ')
    }, msg.member.server.id).then(content => {
        bot.createMessage(msg.channel.id, content);
    }).catch(() => {
        bot.createMessage(msg.channel.id, 'There was an error retrieving your tag');
    });
}, {
    description: 'Get a tag',
    fullDescription: 'The bot will retrieve a tag from your server',
    usage: '<tag name>'
});

tag.registerSubcommand('create', (msg, args) => {
    if(args.length < 2) return 'Please supply a tag name and content';

    let doc = {
        creator: msg.author.id,
        time: msg.timestamp,
        tag: args.shift(),
        content: args.join(' '),
        views: 0
    };

    tags.createTag(doc, msg.member.server.id).then(content => {
        bot.createMessage(msg.channel.id, content);
    }).catch(() => {
        bot.createMessage(msg.channel.id, 'There was an error creating your tag');
    });
}, {
    description: 'Create a tag',
    fullDescription: 'The bot will create a tag with the specified content',
    usage: '<tag name> <tag content>'
});

tag.registerSubcommand('edit', (msg, args) => {
    if(args.length < 2) return 'Please supply a tag name and content';

    let old = {
        tag: args.shift(),
        creator: msg.author.id
    };

    tags.editTag(old, {
        $set: {
            views: 0, time: msg.timestamp, content: args.join(' ')
        }
    }, msg.member.server.id).then(content => {
        bot.createMessage(msg.channel.id, content);
    }).catch(() => {
        bot.createMessage(msg.channel.id, 'There was an error editing your tag');
    });
}, {
    description: 'Edit a tag',
    fullDescription: 'The bot will edit a tag with new content, only useable on tags you\'ve created',
    usage: '<tag name> <new tag content>'
});

tag.registerSubcommand('remove', (msg, args) => {
    if(args.length === 0) return 'Please supply a tag';

    tags.removeTag({
        tag:args.join(' '),
        creator:msg.author.id
    }, msg.member.server.id).then(content => {
        bot.createMessage(msg.channel.id, content);
    }).catch(() => {
        bot.createMessage(msg.channel.id, 'There was an error removing your tag');
    });
}, {
    description: 'Remove a tag',
    fullDescription: 'The bot will remove a tag, only useable on tags you\'ve created',
    usage: '<tag name>'
});