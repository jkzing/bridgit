const _ = require('lodash');
const fs = require('fs');
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
        let configData = fs.readFileSync(configFilePath, {encoding: 'utf-8'});
        let defaultsData = fs.readFileSync(defaultsPath, {encoding: 'utf-8'});
        storedConf = JSON.parse(configData);
        defaultsConf = JSON.parse(defaultsData);
    } catch (e) {throw e}
    defaultsConf = defaultsConf || {};
    // ignore properties that are empty (null)
    storedConf = clearEmpty(storedConf || {});
    args = args.map(arg => clearEmpty(arg));
    return _.merge(defaultsConf, storedConf, ...args);
}
