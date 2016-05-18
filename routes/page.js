'use strict';
var querylib = require('./querylib');
var router = require('koa-router')();
var co  = require('co');
var _ = require('underscore');
var querylib = require('./querylib');
var mp = require('../models/mobileProvision');
router.all('/add', function *(next) {
    "use strict";
    //mobile provison
    var mobileProvision = yield new Promise(function(resolver,reject){
        mp.find(
            {},
            'id UUID Name appId',
            {
                //skip: (data.pageNumber-1)*data.tasksPerPage ,
                //limit: data.tasksPerPage,
                //sort: {id: -1}
            },
            function (err, tasks) {
                if(err) {
                    reject(err);
                    return;
                }
                if(tasks.length==0) {
                    reject('no data');
                    return;
                }
                resolver(tasks);
            });
    });
    if(this.query.taskid){
        var queryStatement = {"id":this.query.taskid};
        var promise = querylib.queryOne(queryStatement);
        var corender = co.wrap(this.render);
        yield promise
            .then(_.bind(function(task) {
                console.log(task);
                return corender.call(this,'add',{title:'添加任务',task:task,mobileProvision:mobileProvision});
            },this))
            .then(function(){
                console.log('render finished');
            })
            .catch(_.bind(function(err){
                console.log(err);
                this.body = err;
            },this));
    }else{
        yield this.render('add',{title:'添加任务',task:{},mobileProvision:mobileProvision});
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
    //yield this.render('news');
    this.body = 'Hello World';
    //yield this.render('news',{title:'消息'});
    yield next;
});
router.get('/mp', function *(next) {
    yield this.render('mp',{title:'消息'});
    yield next;
});
router.get('/arguments', function *(next) {
    yield this.render('arguments',{title:'参数'});
    yield next;
});
module.exports = router;
