'use strict';
const koa = require('koa');
const request = require('koa-request');

const readConfiguration = require('./readConfiguration');

let app = koa();

const BASE_URL = 'http://127.0.0.1:8000'

app.use(function *(next) {
    let req = this.request;
    let requestUrl = req.url;

    let authConfig = readConfiguration();
    const auth = require(`./auth_modules/${authConfig.module}`);
    let authorization = auth(req, authConfig.origin, authConfig.options);

    let options = {
        url: authConfig.origin + requestUrl,
        headers: {
            'Authorization': authorization
        }
    }
    
    console.log(`Sending request to: ${options.url}`);
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
});

app.listen(3000);
