const path = require('path');
const os = require('os');

module.exports = {
    configFilePath: path.join(os.homedir(), '.bridgit.json')
}