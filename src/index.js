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

const initialize = require('./initialize');
const configApp = require('./commands/config');
const readConfiguration = require('./utils/readConfiguration');

const config = readConfiguration(argv);

let commands = argv._;

module.exports = function() {
    if (!!~commands.indexOf('config')) {
        let cfg = _.defaultsDeep({}, argv);
        delete cfg._;

        configApp(cfg);
    } else {
        initialize(config);
        console.log('new version');
    }
}

