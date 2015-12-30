'use strict';
var querylib = require('./querylib');
var router = require('koa-router')();
var co  = require('co');
var _ = require('underscore');
var querylib = require('./querylib');
var task  = require('../models/task');
//router.get('/', function *(next) {
//    yield this.render('add');
//    //this.body = {'message':"ok"};
//    yield next;
//});
router.all('/add', function *(next) {
    "use strict";
    if(this.query.taskid){
        var queryStatement = {"id":this.query.taskid};
        var promise = querylib.queryOne(queryStatement);
        var corender = co.wrap(this.render);
        yield promise
            .then(_.bind(function(task) {
                console.log(task);
                return corender.call(this,'add',{title:'添加任务',task:task});
            },this))
            .then(function(){
                console.log('render finished');
            })
            .catch(_.bind(function(err){
                console.log(err);
                this.body = err;
            },this));
    }else{
        yield this.render('add',{title:'添加任务',task:{}});
    }
    yield next;
});
router.get('/history', function *(next) {
    yield this.render('history',{title:'历史任务'});
    yield next;
});
router.get('/main', function *(next) {
    yield this.render('main',{title:'首页'});
    yield next;
});
router.get('/', function *(next) {
    yield this.render('main',{title:'首页'});
    yield next;
});
router.get('/news', function *(next) {
    yield this.render('news',{title:'消息'});
    yield next;
});
module.exports = router;
