'use strict';
var task  = require('../models/task');
var mp = require('../models/mobileProvision');
var router = require('koa-router')();
var co  = require('co');
var _ = require('underscore');
var monitor = require('../build');
var querylib = require('./querylib');
//body
var koaBody = require('koa-body')({multipart:true});

router.get('/tasks', koaBody, function *(next) {
    var data =  this.request.query;
    var promise = querylib.queryAll(data);
    console.log(this.request.query);
    var corender = co.wrap(this.render);
    yield promise
        .then(_.bind(function(tasks) {
            this.body = tasks;
        },this))
        .then(function(){
            console.log('tasks render finished!');
        }).catch(_.bind(function(err){
            console.log(err);
            this.body = err;
        },this));
    yield next;
});

router.get('/task/:id',function*(next){
    var queryStatement = {"id":this.params.id};
    var promise = querylib.queryOne(queryStatement);
    var corender = co.wrap(this.render);
    yield promise
        .then(_.bind(function(tasks) {
            this.body = tasks;
        },this))
        .then(function(){
            console.log('task render finished!');
        })
        .catch(_.bind(function(err){
            console.log(err);
            this.body = err;
        },this));
    yield next;
});
/*
* 16:11开始写post api
* 获取req
* save到数据库
*16:43基本写好
* */
router.post('/task', koaBody, function*(next){
    var newTask = new task();
    var packConfig =  this.request.body;
    newTask.id = Date.parse(new Date());
    newTask.startTime = new Date();
    newTask.baseSvn = packConfig.baseSvn;
    newTask.projectSvn = packConfig.projectSvn;
    newTask.appVersion = packConfig.appVersion;
    newTask.appName = packConfig.appName;
    newTask.appPackageName = packConfig.appPackageName;
    newTask.appDescription = packConfig.appDescription;
    newTask.appIcon = packConfig.appIcon;
    newTask.appContent = packConfig.appContent;
    newTask.appPlugin = packConfig.appPlugin || packConfig['appPlugin[]'];
    newTask.projectSvnUser = packConfig.projectSvnUser;
    newTask.projectSvnPassword = packConfig.projectSvnPassword;
    newTask.appPlatform = packConfig.appPlatform;
    newTask.appBuildType = packConfig.appBuildType;
    newTask.status = 'waiting';
    newTask.apkDownloadLink = '../../yigomobile/public/apk/' + newTask.id  + '/' + newTask.appName + '-' + newTask.appBuildType + '.apk';
    newTask.ipaLink = '../../yigomobile/public/ios/' + newTask.id  + '/' + newTask.appName + '-' + newTask.appBuildType + '.ipa';

    yield newTask.save(function (err) {
        if (err) {
            this.body = err;
        }
    });
    yield this.body = {message: '任务提交成功'};
    yield next;
});
router.get('/busy', function *(next) {
    this.body = {message: monitor.isBusy()};
    yield next;
});
router.delete('/task/:id',function*(next){
    task.remove({
        id: this.params.id
    }, function(err, bear) {
        if (err)
            console.log('error');
        console.log({ message: 'Successfully deleted' });
    });
    yield next;
});
router.delete('/tasks',function*(next){
    task.remove({}, function(err, bear) {
        if (err)
            console.log('error');
        console.log({ message: 'Successfully deleted' });
    });
    yield next;
});
router.get('/os',function*(next){
    var os = require('os');
    var platform = os.platform();
    var release = os.release();
    var freemem = os.freemem();
    var totalmem = os.totalmem();
    var type = os.type();

    yield this.body = {platform: platform,release: release, freemem: freemem,totalmem: totalmem, type: type};
    yield next;
});
router.get('/process',function*(next){
    var process = require('process');
    var versions = process.versions;
    yield this.body = {versions: versions};
    yield next;
})

//mobile provision
router.post('/mp', koaBody, function*(next){
    var newMP = new mp();
    var packConfig =  this.request.body;
    newMP.UUID = packConfig.UUID;
    newMP.Name = packConfig.Name;
    newMP.appId = packConfig.appId;
    yield newMP.save(function (err) {
        if (err) {
            this.body = err;
        }
    });
    yield this.body = {message: '任务提交成功'};
    yield next;
});
router.get('/mp', koaBody, function*(next){
    var newMP = new mp();
    var packConfig =  this.request.body;
    newMP.UUID = packConfig.UUID;
    newMP.Name = packConfig.Name;
    newMP.appId = packConfig.appId;
    yield newMP.save(function (err) {
        if (err) {
            this.body = err;
        }
    });
    yield this.body = {message: '任务提交成功'};
    yield next;
});
router.get('/mps', koaBody, function *(next) {
    var data =  this.request.query;
    var promise = yield function(){
        return new Promise(function(resolver,reject){
        mp.find(
            {},
            '',
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
    })};
    console.log(this.request.query);
    var corender = co.wrap(this.render);
    yield promise
        .then(_.bind(function(tasks) {
            this.body = tasks;
        },this))
        .then(function(){
            console.log('tasks render finished!');
        }).catch(_.bind(function(err){
            console.log(err);
            this.body = err;
        },this));
    yield next;
});

module.exports = router;
