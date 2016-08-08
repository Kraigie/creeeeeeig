'use strict;';

const axios = require('axios');
const auth = require('../../auth');

module.exports.getLink = function(link, query) {
    if(!query) return Promise.resolve(link);

    return new Promise((resolve, reject) => {
        let options = {
            url: '/youtube/v3/search',
            baseURL: 'https://www.googleapis.com',
            params: {
                q: link,
                part: 'snippet',
                key: auth.yt_key,
                maxResults: '1',
                type: 'video'
            },
            responseType: 'json',
            validateStatus: (status) => {
                return status >= 200 && status < 300;
            }
        };

        axios(options).then(resp => {
            return resolve(`https://www.youtube.com/watch?v=${resp.data.items[0].id.videoId}`);
        }).catch(err => {
            console.log(`Error geting YT song: ${err.stack}`);
            return reject(new Error(`Error getting YT song`));
        });
    });
};

module.exports.getSource = function(song) {
    try {
        if(/s\w*c|y\w*t/.test(song)) {
            if(/s\w*c/.test(song)) return 'sc'; //TODO: Check for links, so a . after c etc.
            if(/y\w*t/.test(song)) return 'yt';
        }
        else {
            if(/http/.test(song)) return;
            return 'query';
        }
    } catch(err) {
        console.log(`Error with regex in getSource function: ${err}`);
        return;
    }
};

module.exports.strToMs = function(time) {
    let num = 0;
    try {
        num = time.match(/(\d+ ?[mhs])/gi);
    } catch(err) {
        console.log(`Error with regex in strToMs function: ${err}`);
        return;
    }

    if(!num || num.length < 1 || num.length > 3) return;
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
    retStr += `${parseInt(hours)} hour(s) `;
    if(minutes)
    retStr += `${parseInt(minutes)} minute(s) `;
    if(seconds)
    retStr += `${parseInt(seconds)} second(s) `;

    let indexLstMatch = time.lastIndexOf(num[num.length - 1]) + num[num.length - 1].length - 1;
    let lstSpcAftMtch = time.indexOf(' ', indexLstMatch);   //these variable names tho

    return {
        ms: (parseInt(hours) * 3600000) + (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000),
        str: retStr,
        content: time.substring(lstSpcAftMtch)
    };
};
