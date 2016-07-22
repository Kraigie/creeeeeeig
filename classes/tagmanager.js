'use strict;';

let config = require('../config.js');
let Datastore = require('nedb');

module.exports = class TagManager {
    constructor(serverid) {
        this.serverid = serverid;
        this.tags = new Datastore({
            filename: `${config.db_store_location}/${this.serverid}/tags.db`,
            autoload: true,
            onload: (err) => {
                if(err) console.log(`Error in onLoad while creating db: ${err}`);
                this.tags.ensureIndex({ fieldName: 'tag', unique: true }, err => {
                    if(err) {
                        console.log(`Error ensuring unique index: ${err}`);
                    }
                });
            }
        });
    }

    getTag(tag) {
        return new Promise((resolve, reject) => {
            this.tags.findOne(tag, (err, doc) => {
                if(err) {
                    console.log(`'Error getting tag: ${err}'`);
                    return reject(err);
                }

                if(!doc) {
                    return resolve(`Tag \`${tag.tag}\` couldn't be found`);
                }

                this.tags.update(tag, {$inc: {views: 1}}, {}, (err) => {
                    if(err) {
                        console.log(`Error updating document view count: ${err}`);
                        return reject(err);
                    }

                    return resolve(doc.content);
                });
            });
        });
    }

    createTag(toCreate) {
        return new Promise((resolve, reject) => {
            this.tags.insert(toCreate, (err) => {
                if(err) {
                    if(err.errorType === 'uniqueViolated') return resolve(`Tag \`${toCreate.tag}\` already exists`);
                    console.log(`Error inserting document: ${err.message}`);
                    return reject(err);
                }

                return resolve(`:ok: Tag \`${toCreate.tag}\` successfully created :ok:`);
            });
        });
    }

    removeTag(toDelete) {
        return new Promise((resolve, reject) => {
            this.tags.remove(toDelete, {}, (err, numRemoved) => {
                if(err) {
                    console.log(`Error deleting document: ${err}`);
                    return reject(err);
                }

                if(numRemoved === 0) return resolve(`The tag you supplied does not exist or you did not create it`);

                return resolve(`:ok: Tag \`${toDelete.tag}\` deleted :ok:`);
            });
        });
    }

    updateTag(old, toChange) {
        return new Promise((resolve, reject) => {
            this.tags.update(old, toChange, {}, (err, numAffected) => {
                if (err) {
                    console.log(`Error updating document: ${err}`);
                    return reject(err);
                }

                if(numAffected === 0) {
                    return resolve(`Tag doesn't exist`);
                }

                return resolve(`The tag \`${old.tag}\` was updated :ok:`);
            });
        });
    }

    getAllTags() {
        return new Promise((resolve, reject) => {
            this.tags.find({}, (err, docs) => {
                if (err) {
                    console.log(`Error retrieving documents: ${err}`);
                    return reject(err);
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