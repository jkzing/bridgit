'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('./logger');

module.exports = function start(module, config) {
    let app = new Koa();

    app.use(bodyParser());
    let middleware = require(`../middlewares/${module}`);
    app.use(middleware(config));

    let port = config.port || 3000;
    app.listen(port);
    logger.colorful(`> ${module.toUpperCase()} proxy server start listening on http://127.0.0.1:${port}`);
}
