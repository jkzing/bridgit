/**
 * koa middleware for hawk auth
 */

const hawk = require('hawk');
const request = require('koa-request');
const logger = require('../utils/logger');

function createHawkHeader(request, origin, options={}) {
    let contentType, payload = '';
    let urlWithoutQuery = request.url.split('?')[0];
    const url = origin + urlWithoutQuery;
    const method = request.method;

    if (request.hasOwnProperty('body')) {
        if (Object.keys(request.body).length) payload = JSON.stringify(request.body);
    }

    if (payload && request.headers.hasOwnProperty('content-type')) {
        contentType = request.headers['content-type'];
    } else {
        contentType = 'text/plain';
    }

    let authOptions = {
        credentials: {
            id: `${options.id}`,
            key: options.key,
            algorithm: options.algorithm
        },
        contentType,
    };

    if (options.encryptPayload) {
        authOptions.payload = payload;
    }

    let artifact = hawk.client.header(url, method, authOptions);

    return artifact.err ? undefined : artifact.field;
}

module.exports = function hawkMiddleWare(config) {
    return function* (next) {
        let req = this.request;
        let requestUrl = req.url;

        let authorization = createHawkHeader(req, config.origin, config.options);

        let options = {
            method: req.method,
            url: config.origin + requestUrl,
            headers: {
                'Authorization': `${config.prefix || ''}${authorization}`
            }
        }

        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            options.json = req.body;
        }

        logger.info(`Sending ${req.method} request to ${options.url}.`, true);
        let response = yield request(options);
        if (Math.floor(response.statusCode / 100) === 2) {
            logger.success('Request success, sending back response.', true);
        } else {
            logger.error(`Request failed with status ${response.statusCode} ${response.statusMessage}.`, true);
        }
        let responseBody;
        try {
            responseBody = JSON.parse(response.body);
        } catch (e) {
            responseBody = response.body;
        }

        this.status = response.statusCode;
        this.body = responseBody;
    }
}
