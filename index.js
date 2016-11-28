#!/usr/bin/env node

'use strict';

/**
 * Arguments:
 *   --port
 *   --origin
 *   --prefix
 *   --algorithm
 *   --hawk-id
 *   --hawk-key
 */
const _ = require('lodash');
const argv = require('minimist')(process.argv.slice(2));

const init = require('./lib/init');
const configApp = require('./lib/configApp');
const readConfiguration = require('./lib/readConfiguration');


const config = readConfiguration(argv);

let commands = argv._;

if (!!~commands.indexOf('config')) {
    let cfg = _.defaultsDeep({}, argv);
    delete cfg._;

    configApp(cfg);
} else {
    init(config);
}
