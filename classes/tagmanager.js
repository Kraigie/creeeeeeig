'use strict;';

let config = require('../config.json');
let Datastore = require('nedb');

function createStore(serverId) {
    let db = new Datastore({
        filename: `${config.db_store_location}/${serverId}/tags.db`,
        autoload: true,
        onload: (err) => {
            if(err) console.log(`Error in onLoad while creating db: ${err}`);
            db.ensureIndex({ fieldName: 'tag', unique: true }, err => {
                if(err) {
                    console.log(`Error ensuring unique index: ${err}`);
                }
            });
        }
    });
    return db;
}

module.exports = class TagManager {
    constructor() {
        this.tags = {};
    }

    getTag(tag, serverId) {
        let tags = this.tags[serverId] = this.tags[serverId] || createStore(serverId);
        return new Promise((resolve, reject) => {
            tags.findOne(tag, (err, doc) => {
                if(err) {
                    console.log(`'Error getting tag: ${err}'`);
                    return reject();
                }

                if(!doc) {
                    return resolve(`Tag \`${tag.tag}\` couldn't be found`);
                }

                tags.update(tag, {$inc: {views: 1}}, {}, (err) => {
                    if(err) {
                        console.log(`Error updating document view count: ${err}`);
                        return reject();
                    }

                    return resolve(doc.content);
                });
            });
        });
    }

    createTag(toCreate, serverId) {
        let tags = this.tags[serverId] = this.tags[serverId] || createStore(serverId);
        return new Promise((resolve, reject) => {
            tags.insert(toCreate, (err) => {
                if(err) {
                    if(err.errorType === 'uniqueViolated') return resolve(`Tag \`${toCreate.tag}\` already exists`);
                    console.log(`Error inserting document: ${err.message}`);
                    return reject();
                }

                return resolve(`:ok: Tag \`${toCreate.tag}\` successfully created :ok:`);
            });
        });
    }

    removeTag(toDelete, serverId) {
        let tags = this.tags[serverId] = this.tags[serverId] || createStore(serverId);
        return new Promise((resolve, reject) => {
            tags.remove(toDelete, {}, (err, numRemoved) => {
                if(err) {
                    console.log(`Error deleting document: ${err}`);
                    return reject();
                }

                if(numRemoved === 0) return resolve(`The tag you supplied does not exist or you did not create it`);

                return resolve(`:ok: Tag \`${toDelete.tag}\` deleted :ok:`);
            });
        });
    }

    editTag(old, toChange, serverId) {
        let tags = this.tags[serverId] = this.tags[serverId] || createStore(serverId);
        return new Promise((resolve, reject) => {
            tags.update(old, toChange, {}, (err, numAffected) => {
                if (err) {
                    console.log(`Error updating document: ${err}`);
                    return reject();
                }

                if(numAffected === 0) {
                    return resolve(`Tag doesn't exist`);
                }

                return resolve(`The tag \`${old.tag}\` was updated :ok:`);
            });
        });
    }

    getAllTags(serverId) {
        let tags = this.tags[serverId] = this.tags[serverId] || createStore(serverId);
        return new Promise((resolve, reject) => {
            tags.find({}, (err, docs) => {
                if (err) {
                    console.log(`Error retrieving documents: ${err}`);
                    return reject();
                }

                if (!docs) {
                    return resolve(`No tags found`);
                }

                let retStr = 'Tags:';
                for(let doc of docs) {
                    retStr+= ` \`${doc.tag}\``;
                }

                return resolve(retStr);
            });
        });
    }
};