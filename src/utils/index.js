module.exports = {
    clearEmpty,
};

function clearEmpty(obj) {
    if (typeof obj !== 'object') throw new Error('argument expected to be an object!');
    let o = Object.assign({}, obj);
    let val;
    for (let key in o) {
        val = o[key];
        if (val === null || val === undefined) {
            delete o[key];
        }
    }
    return o;
}
