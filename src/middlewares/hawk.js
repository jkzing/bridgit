/**
 * koa middleware for hawk auth
 */

const hawk = require('hawk');

function createHawkHeader(request, origin, options={}) {
    let contentType, payload = '';
    let urlWithoutQuery = request.url.split('?')[0];
    // if not production env, replace mock port with django server port
    //eslint-disable-next-line
    const url = origin + urlWithoutQuery;
    const method = request.method;

    if (request.hasOwnProperty('body')) {
        if (Object.keys(request.body).length) payload = request.body;
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
            algorithm: 'sha256'
        },
        payload: payload,
        contentType: contentType
    };

    let artifact = hawk.client.header(url, method, authOptions);

    return artifact.err ? undefined : artifact.field;
}

module.exports = function hawkMiddleWare(config) {
    return function* (next) {
        let req = this.request;
        let requestUrl = req.url;

        const auth = require(`../modules/${config.module}`);
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

        console.log(`${req.method}ing request to: ${options.url}`);
        let response = yield request(options);
        console.log(`Request complete with ${response.statusCode} ${response.statusMessage}`);
        let responseBody;
        try {
            responseBody = JSON.parse(response.body);
        } catch (e) {
            console.error(e);
            responseBody = response.body;
        }

        this.body = responseBody;
    }
}

// function createHawkHeader(request, origin, options) {
//     let contentType, payload = '';
//     let urlWithoutQuery = request.url.split('?')[0];
//     const url = origin + urlWithoutQuery;
//     const method = request.method;

//     if (request.hasOwnProperty('body')) {
//         payload = JSON.stringify(request.body);
//     }

//     if (request.headers.hasOwnProperty('content-type')) {
//         contentType = request.headers['content-type'];
//     } else {
//         contentType = 'text/plain';
//     }

//     let authOptions = {
//         credentials: {
//             id: options.id,
//             key: options.key,
//             algorithm: options.algorithm
//         },
//         contentType: contentType
//     };

//     if (options.encryptPayload) {
//         authOptions.payload = payload;
//     }

//     let artifact = hawk.client.header(url, method, authOptions);

//     return artifact.err ? undefined : artifact.field;
// }