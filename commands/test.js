let arr = [];
arr.push('hello');
arr.push('world');

bot.registerCommand('test', (msg, args) => {
    return arr;
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
