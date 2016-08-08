'use strict;';

module.exports = class Playlist {
    constructor(link, requester, type) {
        this.link = link;
        this.requester = requester;
        this.type = type;
    }
};