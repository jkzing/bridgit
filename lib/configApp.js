'use strict';

const nconf = require('nconf');

let configPath = require.resolve('../config/config.json');

module.exports = function configApp(configuration) {
    nconf.file(configPath);
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
