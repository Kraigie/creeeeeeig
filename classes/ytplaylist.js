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
                    key: auth.yt_key,
                    part: 'contentDetails',
                    playlistId: this.playlistId,
                    maxResults: 10
                },
                responseType: 'json',
                validateStatus: (status) => {
                    if(status !== 200) console.log(`received ${status} from soundcloud resolve`);
                    return status >= 200 && status < 300;
                }
            };

            axios(options).then(resp => {
                let tracks = resp.data.items;
                tracks = tracks.map(item => new YtSong(`https://www.youtube.com/watch?v=${item.contentDetails.videoId}`, this.requester, this.type));
                return resolve(tracks);
            }).catch(err => {
                return reject(err);
            });
        });
    }
};