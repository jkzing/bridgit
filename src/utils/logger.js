const chalk = require('chalk');
const log = console.log;

function info(i) {
    log(i);
}

function warn(i) {
    log(i);
}

function error(i) {
    log(i);
}

function success(i) {
    log(i);
}

function config(conf={}) {
    log(
        Object.entries(conf).map(([k, v]) => `${k}: ${v || ''}`).join('\n')
    );
}

module.exports = {
    info,
    warn,
    error,
    success,
    config,
}
