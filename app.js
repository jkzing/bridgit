'use strict';
const koa = require('koa');
const request = require('koa-request');
const hawk = require('hawk');

let app = koa();

const BASE_URL = 'http://127.0.0.1:8000'

app.use(function *(next) {
    let req = this.request;
    let requestUrl = req.url;

    let authorization = createHawkHeader(req);
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


function createHawkHeader(request) {
    let contentType, payload = '';
    const url = BASE_URL + request.url;
    const method = request.method;

    if (request.hasOwnProperty('data')) payload = JSON.parse(request.data);

    if (payload && request.headers.hasOwnProperty('Content-Type')) {
        contentType = request.headers['Content-Type'];
    } else {
        contentType = 'text/plain';
    }

    let options = {
        credentials: {
            id: request.headers['Hawk-Auth-Id'],
            key: request.headers['Hawk-Auth-Key'],
            algorithm: request.headers['Hawk-Auth-Algorithm']
        },
        payload: payload,
        contentType: contentType
    };

    let artifact = hawk.client.header(url, method, options);

    return artifact.err ? undefined : artifact.field;
}
