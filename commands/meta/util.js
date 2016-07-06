'use strict';

module.exports.strToMs = function(time) {
    let num = 0;
    try {
        num = time.match(/(\d+[mhs])/gi);
    } catch (err) {
        console.log(`Error with regex in strToMs function: ${err}`);
        return;
    }

    if(num.length < 1 || num.length > 3) return;
    num = num.splice(0, 3);

    let hours = 0,
        minutes = 0,
        seconds = 0;

    for(let i of num) {
        if(~i.indexOf('h'))
            hours = i.match(/\d+/);
        if(~i.indexOf('m'))
            minutes = i.match(/\d+/);
        if(~i.indexOf('s'))
            seconds = i.match(/\d+/);
    }

    let retStr = '';
    if(hours)
        retStr += `${parseInt(hours)} hours `;
    if(minutes)
        retStr += `${parseInt(minutes)} minutes `;
    if(seconds)
        retStr += `${parseInt(seconds)} seconds `;

    return {
        ms: (parseInt(hours) * 3600000) + (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000),
        str: retStr,
        content: time.substring(time.lastIndexOf(num[num.length - 1]) + num[num.length - 1].length)
    }
}
