"use strict";
var koa = require('koa');
var jade = require('jade');
var monitor = require('./build');
var app = koa();
//可用目录
var serve = require('koa-static');
app.use(serve('.'));
//Querystring
require('koa-qs')(app)
//views
var views = require('koa-views');
app.use(views('views', {
    root: __dirname+'views',
    default:'jade'
}));

//router
var router = require('koa-router')();
var api = require('./routes/api');
router.use('/yigomobile/api',api.routes());

var page = require('./routes/page');
router.use('/yigomobile',page.routes());

app.use(router.routes())
    .use(router.allowedMethods());

//port
app.listen(3001);
monitor.start();
