'use strict;';

let config = require('../config.js');
let Datastore = require('nedb');
let _ = require('underscore');

module.exports = class TagManager {
    constructor(serverid) {
        this.serverid = serverid;
        this.tags = new Datastore({
            filename: `${config.db_store_location}/${this.serverid}/tags.db`,
            autoload: true,
            onload: (err) => {
                if(err) console.log(`Erron in onLoad while creating db: ${err}`);
                this.tags.ensureIndex({ fieldName: 'tag', unique: true }, err => {
                    if(err) {
                        console.log(`Error ensuring unique index: ${err}`);
                    }
                });
            }
        });
    }
};