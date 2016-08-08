'use strict;';

const auth = require('../auth');
const Song = require('./song');
const axios = require('axios');

module.exports = class ScSong extends Song {
    constructor(link, requester, type) {
        super(link, requester, type);
        this.streamUrl = '';
    }

    getInfo() {
        return new Promise((resolve, reject) => {
            let options = {
                url: '/resolve',
                baseURL: 'https://api.soundcloud.com',
                params: {
                    url: this.link,
                    client_id: auth.sc_key
                },
                responseType: 'json',
                validateStatus: (status) => {
                    if(status !== 200) console.log(`received ${status} from soundcloud resolve`);
                    return status >= 200 && status < 300;
                }
            };

            axios(options).then(resp => {
                if(!resp.data.streamable) {
                    return reject(new Error('Soundcloud track is not streamable'));
                }

                this.title = resp.data.title;
                this.streamUrl = resp.data.stream_url;
                return resolve(this);
            }).catch(err => {
                return reject(err);
            });
        });
    }

    getStream() {
        return new Promise((resolve, reject) => {
            let options = {
                url: this.streamUrl,
                params: {
                    client_id: auth.sc_key
                },
                responseType: 'stream'
            };

            axios(options).then(resp => {
                return resolve(resp.data);
            }).catch(err => {
                return reject(err);
            });
        });
    }
};