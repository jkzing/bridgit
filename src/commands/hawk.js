const _ = require('lodash');
const start = require('../utils/startServer');
const loadConf = require('../utils/loadConf');

const hawkOptionKeys = ['id', 'key', 'algorithm', 'encryptPayload'];
const optionKeys = ['id', 'key', 'origin', 'port', 'algorithm', 'prefix', 'encryptPayload'];

module.exports = function action(options) {
    if (typeof options !== 'object') {
        throw new Error('Wrong command arguments provided.');
    }

    let config = _.pick(options, optionKeys);
    config = loadConf(config);
    config = Object.assign(
        {}, 
        _.omit(config, hawkOptionKeys), 
        {options: _.pick(config, hawkOptionKeys)}
    );
    start('hawk', config);
}
