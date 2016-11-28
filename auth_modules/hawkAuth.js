'use strict'
const hawk = require('hawk');

function createHawkHeader(request, origin, options) {
    let contentType, payload = '';
    let urlWithoutQuery = request.url.split('?')[0];
    const url = origin + urlWithoutQuery;
    const method = request.method;

    if (request.hasOwnProperty('body') && Object.keys(request.body).length > 0) {
        payload = JSON.stringify(request.body);
    }

    if (payload && request.headers.hasOwnProperty('content-type')) {
        contentType = request.headers['content-type'];
    } else {
        contentType = 'text/plain';
    }

    let authOptions = {
        credentials: {
            id: options.id,
            key: options.key,
            algorithm: options.algorithm
        },
        contentType: contentType
    };

    if (options.encryptPayload) {
        authOptions.payload = payload;
    }

    let artifact = hawk.client.header(url, method, authOptions);

    return artifact.err ? undefined : artifact.field;
}

module.exports = createHawkHeader;
