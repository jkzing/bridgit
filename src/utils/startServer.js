'use strict';

const koa = require('koa');
const bodyParser = require('koa-bodyparser');

module.exports = function start(config) {
    let app = koa();

    app.use(bodyParser());
    let middleware = require(`./middlewares/${config.module}`);
    app.use(middleware(config));

    app.listen(config.port || 3000);
}