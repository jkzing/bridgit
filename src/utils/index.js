'use strict';

module.exports = {
    clearUndefined,
};

function clearUndefined(obj) {
    if (typeof obj !== 'object') throw new Error('argument expected to be an object!');
    let o = Object.assign({}, obj);
    for (let key in o) {
        if (!o[key]) delete o[key];
    }
    return o;
}