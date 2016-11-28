'use strict';

const _ = require('lodash');
const nconf = require('nconf');

const clearUndefined = require('./utils').clearUndefined;
const ENV = require('./../environments');

const defaults = './config/defaults.json';
const config = './../config/config.json';

module.exports = function readConfiguration(argv) {
    nconf.defaults(require.resolve(config));
    nconf.file(defaults);
    let library = nconf.get('library');
    let parseFunc;
    switch (library) {
        case ENV.AUTH_TYPES.HAWK:
            parseFunc = parseHawk;
            break;
        default:
            break;
    }
    return parseFunc(nconf.get(library), argv);
}

function parseHawk(config, argv) {
    let argvOptions = parseArgv(argv);
    let opt =  _.defaultsDeep({}, argvOptions, {options: config}, {
        module: ENV.AUTH_MODULES[nconf.get('library')],
        origin: nconf.get('origin'),
        port: nconf.get('port'),
        prefix: nconf.get('prefix'),
    });
    return clearUndefined(opt);
}

function parseArgv(argv) {
    let commands = argv._;
    return clearUndefined({
        port: argv.port,
        origin: argv.origin,
        prefix: argv.prefix,
        options: clearUndefined({
            id: argv['hawk-id'],
            key: argv['hawk-key'],
            algorithm: argv['hawk-algorithm'],
        }),
    });
}
