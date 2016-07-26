let arr = [];
arr.push('hello');
arr.push('world');

bot.registerCommand('test', (msg, args) => {
    bot.joinVoiceChannel(msg.member.voiceState.channelID)
    .then(conn => {
        conn.playFile('test.mp3');
    });
}, {
    description: 'Test things',
    fullDescription: 'TEEEEESSSSSSSSSSTTTTTTTTTTTtt'
});

bot.registerCommand('test1', (msg, args) => {
    arr.push(Math.random() * 100);
}, {
    description: 'Test things1',
    fullDescription: 'TEEEEESSSSSSSSSSTTTTTTTTTTTtt1'
});

// var keys = Object.keys(this.requirements.permissions);
// if(keys.length > 0) {
//     var flag = true;
//     var permissions = msg.channel.permissionsOf(msg.author.id).json;
//     for(var key of keys) {
//         if(permissions[key]) { //checks to see if they have a yes or no for a permission
//             if(this.requirements.permissions[key] !== permissions[key]) { //if they do have it and they're not allowed
//                 console.log('set false in if');
//                 flag = false;
//                 break;
//             }
//         } else { //they don't have a yes/no for permission
//             if(this.requirements.permissions[key]) { //if it requires yes permission, return false.
//                 console.log('set false in else');   //if permissionX = false, it'll be true since it's not set
//                 flag = false;
//                 break;
//             }
//         }
//     }
//     if(flag) {
//         console.log('return true at flag');
//         return true;
//     } else {
//         console.log('return false at flag');
//         return false;
//     }
// }
