const _ = require('lodash');
const path = require('path');
const os = require('os');
const configFileName = require('../constants').configFileName;

const defaultsPath = path.resolve('../config/defaults.json');

// function validateArgs(args) {
//     let len = args.length;
// }

/**
 * merge config objects
 * no need for deep merge for now
 */
module.exports = function merge(...args) {
    let configPath = path.join(os.homedir(), configFileName);
    let storedConf, defaultsConf;
    try {
        storedConf = require(configPath);
        defaultsConf = require(defaultsPath);
    } catch (e) {}
    storedConf = storedConf || {};
    defaultsConf = defaultsConf || {};
    return _.merge(defaultsConf, storedConf, ...args);
}
