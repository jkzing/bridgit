'use strict';

const koa = require('koa');
const request = require('koa-request');
const bodyParser = require('koa-bodyparser');

module.exports = function init(config) {
    let app = koa();

    app.use(bodyParser());
    app.use(function *(next) {
        let req = this.request;
        let requestUrl = req.url;

        const auth = require(`../modules/${config.module}`);
        let authorization = auth(req, config.origin, config.options);

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
    });

    app.listen(config.port || 3000);
}
