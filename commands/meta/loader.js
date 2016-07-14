'use strict;';

let fs = require('fs');

let path = require('path').join(__dirname, '../');
fs.readdirSync(path).forEach(file => {
    if(!fs.lstatSync(path + file).isDirectory())
        require(`../${file}`);
});
