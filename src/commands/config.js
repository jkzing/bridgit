const _ = require('lodash');
const fs = require('fs');
const logger = require('../utils/logger');

const {configFilePath, configKeys} = require('../constants');

let commands = {
    get(key, value, options) {
        // value should be ommited
        let config
        try {
            config = require(configFilePath);
        } catch(e) {
            logger.error('No configuration file found, or configuration file is not valid JSON.');
            return;
        }
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
        let config;
        try {
            config = require(configFilePath);
        } catch(e) {
            config = {}
        }
        config = _.merge(
            config,
            {[key]: value}
        );
        fs.writeFileSync(configFilePath, JSON.stringify(config), {
            encoding: 'utf-8',
        });
    },
    new(filePath, omit, options) {
        let data = _.zipObject(configKeys, Array(configKeys.length).fill(null));
        if (!/.json$/.test(filePath)) {
            filePath = filePath + '.json';
        }
        fs.writeFile(filePath, JSON.stringify(data, null, 4), {
            encoding: 'utf-8',
        }, (err) => {
            if (err) {
                logger.error(err.message);
                return;
            }
            logger.success(`${filePath} created successfully.`);
        });
    }
}


module.exports = function action(cmd, key, value, options) {
    if (!commands.hasOwnProperty(cmd)) {
        logger.error(`Command argument should be one of ${Object.keys(commands).join(', ')}.`)
        return;
    }

    commands[cmd](key, value, options);
}
