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
const bridgit = require('commander');

bridgit
    .version('0.2.3');

bridgit
    .command('hawk')
    .description('start hawk authorization proxy server')
    .option('-i, --id <id>', 'The hawk credential id')
    .option('-k, --key <key>', 'The hawk credential key')
    .option('-p, --port <port>', 'Which port should proxy server start on')
    .option('-a, --algorithm <algorithm>', 'Which algorithm should hawk use to encrypt')
    .option('-P, --prefix <prefix>', 'Prefix string that should be added to request header')
    .option('-E, --encrypt-payload', 'Should hawk encrypt request body')
    .action((options) => {
        console.log(options.id, options.key);
    });


module.exports = function() {
    bridgit.parse(process.argv);
}

