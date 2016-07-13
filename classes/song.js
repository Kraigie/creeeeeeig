'use strict;'

module.exports = class Song {
    constructor(link, requester, type) {
        this.link = link;
        this.requester = requester;
        this.type = type;

        this.title = '';
    }

    getPrettyInfo(playing) {
        if (playing) return `:headphones: \`${this.title}\` | **${this.requester}** | from ${this.type}`
        return `${this.title} | ${this.requester} | from ${this.type}`
    }
}