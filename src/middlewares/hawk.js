/**
 * koa middleware for hawk auth
 */

const hawk = require('hawk');
const axios = require('axios');
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
    const endpoint = axios.create({
        baseURL: config.origin,
        timeout: 3000
    });
    return async function (ctx, next) {
        let req = ctx.request;
        let requestUrl = req.url;

        let authorization = createHawkHeader(req, config.origin, config.options);

        let options = {
            method: req.method,
            url: config.origin + requestUrl,
            headers: {
                'Authorization': `${config.prefix || ''}${authorization}`
            }
        }

        // set content type if it has one
        const contentType = req.headers['content-type'];
        if (contentType) {
            options.headers['content-type'] = contentType;
        } else {
            options.headers['content-type'] = 'text/plain';
        }

        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            options.data = req.data;
        }

        logger.info(`Sending ${req.method} request to ${options.url}.`, true);
        let response
        try {
            response = await endpoint(options);
        } catch (e) {
            response = e.response
        }

        if (Math.floor(response.status / 100) === 2) {
            logger.success('Request success, sending back response.', true);
        } else {
            logger.error(`Request failed with status ${response.status} ${response.statusText}.`, true);
        }

        let responseBody;
        try {
            responseBody = JSON.parse(response.data);
        } catch (e) {
            responseBody = response.data;
        }

        ctx.status = response.status;
        ctx.body = responseBody;
    }
}
