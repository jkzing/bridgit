'use strict';

const path = require('path');
const nconf = require('nconf');

let configPath = path.resolve('./config/config.json');
nconf.defaults(require(path.resolve('./config/defaults.json')));
nconf.file({file: configPath});

module.exports = function configApp(configuration) {
    let hawkReg = /^hawk\-/i;
    for (let key in configuration) {
        if (hawkReg.test(key)) {
            let hawkKey = key.replace(hawkReg, '');
            nconf.set(`hawk:${hawkKey}`, configuration[key]);
        } else {
            nconf.set(key, configuration[key]);
        }
    }
    nconf.save(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.info('configuration saved');
    });
}
