'use strict;'

module.exports = class Player {
    constructor(conn, chann) {
        this.conn = conn;
        this.chann = chann;
        this.queue = [];

        conn.on('end', () => {
            this.playNext()
        });
    }

    addSong(song) {
        if(this.queue.length == 0 && !this.conn.playing) {
            this.queue.push(song);
            this.playNext();
        }
        else {
            this.queue.push(song);
            bot.createMessage(this.chann.id, `Your song was added to the queue in position ${this.queue.length}`);
        }
    }

    playNext() {
        let next = this.queue.shift();

        if(next) {
            this.conn.playStream(next.getStream());
            bot.createMessage(this.chann.id, next.getPrettyInfo(true));
        }
    }

    skip() {
        conn.stopPlaying();
    }
}