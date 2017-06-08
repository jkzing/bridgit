const _ = require('lodash');
const os = require('os');
const configFilePath = require('../constants').configFilePath;
const {clearEmpty} = require('./index');
const logger = require('./logger');

const defaultsPath = require.resolve('../config/defaults.json');

function validateArgs(args) {
    return args.every(arg => typeof arg === 'object');
}

/**
 * merge config objects
 * no need for deep merge for now
 */
module.exports = function merge(...args) {
    if (!validateArgs(args)) {
        throw new Error('Some of merge arguments are not object');
    }
    let storedConf, defaultsConf;
    try {
        storedConf = require(configFilePath);
        defaultsConf = require(defaultsPath);
    } catch (e) {}
    defaultsConf = defaultsConf || {};
    // ignore properties that are empty (null)
    storedConf = clearEmpty(storedConf || {});
    args = args.map(arg => clearEmpty(arg));
    return _.merge(defaultsConf, storedConf, ...args);
}
