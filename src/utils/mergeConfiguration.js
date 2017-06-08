const _ = require('lodash');
const os = require('os');
const configFilePath = require('../constants').configFilePath;

const defaultsPath = require.resolve('../config/defaults.json');

// function validateArgs(args) {
//     let len = args.length;
// }

/**
 * merge config objects
 * no need for deep merge for now
 */
module.exports = function merge(...args) {
    let storedConf, defaultsConf;
    try {
        storedConf = require(configFilePath);
        defaultsConf = require(defaultsPath);
    } catch (e) {}
    storedConf = storedConf || {};
    defaultsConf = defaultsConf || {};
    return _.merge(defaultsConf, storedConf, ...args);
}
