const chalk = require('chalk');
const log = console.log;

function getTimestamp() {
    return new Date().toISOString().replace('T', ' ');
}

function colorful(msg, color='yellow', timestamp=false) {
    if (!chalk[color]) {
        throw new Error('chalk does not have this color');
    }

    if (timestamp) {
        msg = `[${getTimestamp()}] - ${msg}`;
    }
    log(chalk[color](msg));
}

function info(msg, timestamp=false) {
    colorful(msg, 'cyan', timestamp);
}

function warn(msg, timestamp=false) {
    colorful(msg, 'grey', timestamp);
}

function error(msg, timestamp=false) {
    colorful(msg, 'red', timestamp);
}

function success(msg, timestamp=false) {
    colorful(msg, 'green', timestamp);
}

function config(conf={}) {
    console.table(
        Object
            .entries(conf)
            .map(([k, v]) => ({
                key: k,
                value: v,
            }))
    );
}

module.exports = {
    info,
    warn,
    error,
    success,
    config,
    colorful,
}
