const _ = require('lodash');
const fs = require('fs');
const logger = require('../utils/logger');

const configPath = require.resolve('../config/config.json');

let commands = {
    get(key, value, options) {
        // value should be ommited
        let config = require(configPath);
        if (key) {
            logger.config({
                [key]: config[key],
            });
        } else {
            logger.config(config);
        }
    },
    set(key, value, options) {
        if (!key) return;
        let nextConfig = _.merge(
            require(configPath), 
            {[key]: value}
        );
        fs.writeFileSync(configPath, JSON.stringify(nextConfig), {
            encoding: 'utf-8',
        });
    }
}


module.exports = function action(cmd, key, value, options) {
    if (!commands.hasOwnProperty(cmd)) {
        error(`Command argument should be one of ${Object.keys(commands)}.`)
        return;
    }

    commands[cmd](key, value, options);
}
