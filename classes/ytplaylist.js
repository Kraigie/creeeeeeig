const Playlist = require('./playlist');
const axios = require('axios');
const auth = require('../auth.json');
const YtSong = require('./ytsong');

module.exports = class YtPlayList extends Playlist {

    constructor(requester, type) {
        super(requester, type);
    }

    getSongs(link) {
        this.link = link;
        try{
            let regex = /list=([\d\w]+)/;
            this.playlistId = this.link.match(regex)[1];
        } catch(err) {
            return Promise.reject(err);
        }
        return new Promise((resolve, reject) => {
            let options = {
                url: '/youtube/v3/playlistItems',
                baseURL: 'https://www.googleapis.com',
                params: {
                    url: this.playlistID,
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