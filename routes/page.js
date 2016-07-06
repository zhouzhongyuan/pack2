'use strict';
var querylib = require('./querylib');
var router = require('koa-router')();
var co  = require('co');
var _ = require('underscore');
var querylib = require('./querylib');
var mp = require('../models/mobileProvision');
var releaseModel = require('../models/release');
router.all('/add', function *(next) {
    "use strict";
    //mobile provison
    var mobileProvision = yield new Promise(function(resolve,reject){
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
                    resolve('find no data');
                    return;
                }
                resolve(tasks);
            });
    });
    if(this.query.taskid){
        var queryStatement = {"id":this.query.taskid};
        var promise = querylib.queryOne(queryStatement);
        var corender = co.wrap(this.render);
        yield promise
            .then(_.bind(function(task) {
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
    yield this.render('news',{title:'消息'});
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
router.get('/check-update', function *(next) {
    function queryOne(queryStatement) {
        return new Promise(function(resolve,reject){
            releaseModel.find(
                queryStatement,
                function(err, task){
                    if(err){
                        reject(err);
                        return;
                    }
                    if(!task || task.length === 0){
                        reject('no this task');
                        return;
                    }
                    resolve(task);
                })
        });
    };
    if(this.query.appPackageName && this.query.appPlatform) {
        var queryStatement = {
            "appPackageName":this.query.appPackageName,
            "appPlatform":this.query.appPlatform,
        };
        var promise = queryOne(queryStatement);
        yield promise
            .then(_.bind(function(data) {
                this.body = {message:data};
                next;
            },this))
            .catch(_.bind(function(err){
                this.body = {message:err};
                next;
            },this));
    } else {
        this.body = {message: 'your search info is wrong!'};
        yield next;

    }
});
module.exports = router;


