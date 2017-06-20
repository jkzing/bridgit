const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const os = require('os');
const start = require('../utils/startServer');
const merge = require('../utils/mergeConfiguration');
const logger = require('../utils/logger');
const {hawkOptionKeys, configKeys} = require('../constants');

const invalidJsonReg = /JSON/;

module.exports = function action(options) {
    if (typeof options !== 'object') {
        throw new Error('Wrong command arguments provided.');
    }

    let configurations = [];

    let configFile = options.config;
    if (configFile) {
        try {
            let filePath = path.resolve(configFile);
            let configFileData = fs.readFileSync(filePath, {encoding: 'utf-8'});
            configFile = JSON.parse(configFileData);
        } catch (e) {
            if (e.code === 'ENOENT') {
                logger.error(`Can not file config file at ${options.config}.`);
                return;
            } else if (e.message && invalidJsonReg.test(e.message)) {
                logger.error(e.message);
                return;
            } else {
                logger.warn(
                    'Unknown error happened when parsing config file, ' +
                    `config file ${options.config} will be omitted.`
                );
            }
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
