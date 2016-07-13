'use strict;'

const auth = require('../auth');
const Song = require('./song');

module.exports = class ScSong extends Song {
    constructor(link, requester, type) {
        super(link, requester, type);
        this.streamUrl = '';
    }

    getInfo() {
        return new Promise((resolve, reject) => {
            request({
                uri: 'https://api.soundcloud.com/resolve',
                qs: {
                    url: this.link,
                    client_id: auth.sc_key
                },
                json: true
            }, (err, resp, body) => {
                if (err) {
                    console.log(`Error getting soundcloud resolve: ${err}`);
                    throw err;
                } else if (resp.statusCode !== 200) {
                    if(resp.statusCode === 403) {
                        console.log(`Error getting soundcloud resolve : 403`);
                        throw new Error('Received 403 from soundcloud resolve');
                    }
                    console.log(`Error getting soundcloud resolve : != 200`);
                    throw new Error('Didn\'t receive 200 from soundcloud resolve');
                } else {
                    this.title = body.title;
                    this.streamUrl = body.stream_url;
                    return resolve(this);
                }
            })
        });
    }

    getStream() {
        return Promise.resolve(Request({
            url: this.streamUrl,
            qs: {
                client_id: auth.sc_key
            }
        }));
    }
}