'use strict';
const config = require('./config.json');
const ENV = require('./environments');

module.exports = function readConfiguration() {
    let type = config.type;
    let parseFunc;
    switch (type) {
        case ENV.AUTH_TYPES.HAWK:
            parseFunc = parseHawk;
            break;
        default:
            break;
    }
    return parseFunc(config);
}

function parseHawk(config) {
    if (!config.id || !config.key || !config.algorithm)
        throw new Error('Hawk authorization information not complete!');
    return {
        module: ENV.AUTH_MODULES[config.type],
        origin: config.origin,
        options: {
            hawkAuthId: config.id,
            hawkAuthKey: config.key,
            hawkAuthAlgorithm: config.algorithm,
            encryptPayload: config.encryptPayload
        }
    }
}
