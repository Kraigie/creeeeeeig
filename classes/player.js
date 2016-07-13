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
            this.queue.playNext();
        }
        else {
            this.queue.push(song);
            bot.createMessage(chann.id, `Your song was added to the queue in position ${this.queue.length}`);
        }
    }

    playNext() {
        let next = this.queue.shift();

        if(next) {
            next.getStream().then(stream => {
                conn.playStream(stream);
            })
        }
    }

    skip() {
        conn.stopPlaying();
    }
}