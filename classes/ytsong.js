'use strict;';

const ytdl = require('ytdl-core');
const Song = require('./song');

module.exports = class YtSong extends Song {
    constructor(link, requester, type) {
        super(link, requester, type);
    }

    getInfo() {
        return new Promise((resolve, reject) => {
            ytdl.getInfo(this.link, (err, info) => {
                if(err) {
                    console.log(`Error getting yt song info: ${err}`);
                    return reject(err);
                }

                if(!info) {
                    return reject(new Error('Couldn\'t find a song with the search'));
                }

                this.title = info.title;
                return resolve(this);
            });
        });
    }

    getStream() {
        return new Promise((resolve, reject) => {
            let stream = ytdl(this.link, {filter: 'audioonly'}).on('error', err => {
                if(err) {
                    return reject(err);
                }
                console.log(`Error getting yt song stream: ${err}`);
                throw err;
            });
            return resolve(stream);
        });
    }
};
