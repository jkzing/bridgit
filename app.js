'use strict';
const koa = require('koa');
const request = require('koa-request');
const hawk = require('hawk');

let app = koa();

const BASE_URL = 'http://127.0.0.1:8000'

app.use(function *(next) {
    let req = this.request;
    let requestUrl = req.url;

    let authorization = createAuthorizationHeader(req);
    let options = {
        url: BASE_URL + requestUrl,
        headers: {
            'Authorization': authorization
        }
    }

    let response = yield request(options);
    var info = JSON.parse(response.body);

    this.body = info;
});

app.listen(3000);


function createAuthorizationHeader(config) {
    var options, contentType, payload = '',
        artifact;
    // console.log(config);
    if (config.hasOwnProperty('data')) {
        payload = JSON.parse(config.data);
    } else {
        contentType = 'text/plain';
    }
    if (payload && config.headers.hasOwnProperty('Content-Type')) {
        contentType = config.headers['Content-Type'];
    }

    options = {
        credentials: {
            id: 'oN9gmsz19foeli_RQ32Q824Ujzhao',
            key: '5fcb24f335a64687bce4a3970e189d5a',
            algorithm: 'sha256'
        },
        payload: payload,
        contentType: contentType
    };

    var requestOptions = {
        uri: BASE_URL + config.url,
        method: config.method,
        headers: {}
    };

    artifact = hawk.client.header(requestOptions.uri, requestOptions.method, options);

    return artifact.err ? undefined : artifact.field;
}
