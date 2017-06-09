const path = require('path');

exports.requireSrc = (srcPath) => {
    return require('../../src/' + srcPath);
}

exports.resolveSrc = (srcPath) => {
    return path.resolve('src/' + srcPath);
}