const _ = require('lodash');
const path = require('path');
const os = require('os');
const start = require('../utils/startServer');
const merge = require('../utils/mergeConfiguration');

const hawkOptionKeys = ['id', 'key', 'algorithm', 'encryptPayload'];
const configKeys = ['id', 'key', 'origin', 'port', 'algorithm', 'prefix', 'encryptPayload'];

module.exports = function action(options) {
    if (typeof options !== 'object') {
        throw new Error('Wrong command arguments provided.');
    }

    let configurations = [];

    let configFile = options.config;
    if (configFile) {
        try {
            let filePath = path.resolve(configFile);
            configFile = require(filePath);
            console.log(configFile);
        } catch (e) {
            console.error(e);
        }
    }

    if (typeof configFile === 'object') {
        configurations.push(configFile);
    }

    // pick up configuration relavent options
    configurations.push(_.pick(options, configKeys));

    let config = merge.apply(null, configurations);

    const [req, opts] = [
        _.omit(config, hawkOptionKeys),
        _.pick(config, hawkOptionKeys)
    ];

    req.options = opts;

    start('hawk', req);
}
