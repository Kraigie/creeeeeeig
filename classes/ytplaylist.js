const Playlist = require('./playlist');
const axios = require('axios');
const auth = require('../auth.json');
const YtSong = require('./ytsong');

module.exports = class YtPlayList extends Playlist {

    constructor(link, requester, type) {
        super(link, requester, type);
    }

    getSongs() {
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
                let tracks = resp.data.tracks;
                tracks = tracks.filter(track => track.streamable).map(track => new YtSong(track.uri, this.requester, this.type));
                return resolve(tracks);
            }).catch(err => {
                return reject(err);
            });
        });
    }
};