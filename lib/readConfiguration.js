'use strict';

const config = require('./../config.json');
const ENV = require('./../environments');
const clearUndefined = require('./utils').clearUndefined;
const _ = require('lodash');

module.exports = function readConfiguration(argv) {
    let type = config.type;
    let parseFunc;
    switch (type) {
        case ENV.AUTH_TYPES.HAWK:
            parseFunc = parseHawk;
            break;
        default:
            break;
    }
    return parseFunc(config, argv);
}

function parseHawk(config, argv) {
    if (!config.id || !config.key || !config.algorithm)
        throw new Error('Hawk authorization information not complete!');

    let argvOptions = parseArgv(argv);

    let configFileOptions = {
        module: ENV.AUTH_MODULES[config.type],
        origin: config.origin,
        prefix: config.prefix,
        options: {
            hawkAuthId: config.id,
            hawkAuthKey: config.key,
            hawkAuthAlgorithm: config.algorithm,
            encryptPayload: config.encryptPayload
        }
    }
    return _.defaultsDeep({}, argvOptions, configFileOptions);
}

function parseArgv(argv) {
    let commands = argv._;
    return clearUndefined({
        port: argv.port,
        origin: argv.origin,
        prefix: argv.prefix,
        options: clearUndefined({
            hawkAuthId: argv['hawk-id'],
            hawkAuthKey: argv['hawk-key'],
            hawkAuthAlgorithm: argv['hawk-algorithm'],
        }),
    });
}
