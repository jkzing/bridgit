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
require('console.table');
const bridgit = require('commander');
const hawkCommand = require('./commands/hawk');
const configCommand = require('./commands/config');

bridgit
    .version('0.2.3');

bridgit
    .command('hawk')
    .description('start hawk authorization proxy server')
    .option('-i, --id [id]', 'The hawk credential id')
    .option('-k, --key [key]', 'The hawk credential key')
    .option('-o, --origin [origin]', 'The proxy origin server host')
    .option('-p, --port [port]', 'Which port should proxy server start on')
    .option('-a, --algorithm [algorithm]', 'Which algorithm should hawk use to encrypt')
    .option('-P, --prefix [prefix]', 'Prefix string that should be added to request header')
    .option('-E, --encrypt-payload', 'Should hawk encrypt request body')
    .option('-c, --config [config]', 'With a specified config file path')
    .action(hawkCommand);

bridgit
    .command('config <cmd> [key] [value]')
    .description('configuration operations, use --help to checkout')
    .action(configCommand);


module.exports = function() {
    bridgit.parse(process.argv);
}

