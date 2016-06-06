'use strict'
const hawk = require('hawk');

function createHawkHeader(request, origin, options) {
    let contentType, payload = '';
    let urlWithoutQuery = request.url.split('?')[0];
    const url = origin + urlWithoutQuery;
    const method = request.method;

    if (request.hasOwnProperty('data')) payload = JSON.parse(request.data);

    if (payload && request.headers.hasOwnProperty('content-type')) {
        contentType = request.headers['content-type'];
    } else {
        contentType = 'text/plain';
    }

    let authOptions = {
        credentials: {
            id: options.hawkAuthId,
            key: options.hawkAuthKey,
            algorithm: options.hawkAuthAlgorithm
        },
        payload: payload,
        contentType: contentType
    };

    let artifact = hawk.client.header(url, method, authOptions);

    return artifact.err ? undefined : artifact.field;
}

module.exports = createHawkHeader;
