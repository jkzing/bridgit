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
const argv = require('minimist')(process.argv.slice(2));

const init = require('./lib/init');
const readConfiguration = require('./lib/readConfiguration');


const config = readConfiguration(argv);

let commands = argv._;

if (!!~commands.indexOf('config')) {
    console.log(argv);
} else {
    init(config);
}
