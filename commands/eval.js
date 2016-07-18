const config = require('../config');
const now = require('performance-now');
const util = require('util');

bot.registerCommand('eval', (msg, args) => {
    let before = now();

    try {
        let evald = eval(args.join(' '));
        evald = util.inspect(evald);

        if(evald && evald.length > 1800) evald = evald.substring(0, 1800);
        let after = now();

        let retStr = `\`\`\`javascript\n` +
        `Input: ${args.join(' ')}\n` +
        `Output: ${evald}\n` +
        `Time: ${(after - before).toFixed(3)} ms\`\`\``;

        return retStr;
    } catch (err) {
        let after = now();

        let retStr = `\`\`\`javascript\n` +
        `Input: ${args.join(' ')}\n` +
        `Error: ${err}\n` +
        `Time: ${(after - before).toFixed(3)} ms\`\`\``;

        return retStr;
    }
}, {
    description: 'Eval things',
    fullDescription: 'The bot will attempt to evaluate a given expression - limited to bot creator id',
    usage: '<expression>',
    requirements: {
        userIDs: [config.evalid]
    }
});
