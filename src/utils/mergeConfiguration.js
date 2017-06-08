const _ = require('lodash');

const defaults = require.resolve('../config/defaults.json');
const config = require.resolve('../config/config.json');

// function validateArgs(args) {
//     let len = args.length;
// }

/**
 * merge config objects
 * no need for deep merge for now
 */
module.exports = function merge(...args) {
    return _.merge(require(defaults), require(config), ...args);
}
