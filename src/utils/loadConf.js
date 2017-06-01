'use strict';

const _ = require('lodash');
const nconf = require('nconf');

const clearUndefined = require('./index').clearUndefined;

const defaults = require.resolve('../config/defaults.json');
const config = require.resolve('../config/config.json');



module.exports = function loadConf(args={}) {
    return _.merge(require(defaults), require(config), args);
}
