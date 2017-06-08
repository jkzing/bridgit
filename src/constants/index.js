const path = require('path');
const os = require('os');

module.exports = {
    configFilePath: path.join(os.homedir(), '.bridgit.json'),
    hawkOptionKeys: ['id', 'key', 'algorithm', 'encryptPayload'],
    configKeys: ['id', 'key', 'origin', 'port', 'algorithm', 'prefix', 'encryptPayload']
}