'use strict';
var task  = require('../models/task');
var querylib ={};
querylib.queryAll = function(data) {
    return new Promise(function(resolver,reject){
        task.find(
            {},
            'id appName startTime status apkDownloadLink ipaLink appPlatform appBuildType appVersion',
            {
                skip: (data.pageNumber-1)*data.tasksPerPage ,
                limit: data.tasksPerPage,
                sort: {id: -1}
            },
            function (err, tasks) {
            if(err) {
                reject(err);
                return;
            }
            if(tasks.length==0) {
                reject('query no data');
                return;
            }
            resolver(tasks);
        });
    })
};
querylib.queryOne = function(queryStatement) {
    return new Promise(function(resolver,reject){
        task.findOne(queryStatement,function(err, task){
            if(err){
                reject(err);
                return;
            }
            if(!task || task.length === 0){
                reject('no this task');
                return;
            }
            resolver(task);
        })
    });
};
querylib.queryNormal = function(queryNormal) {
    return new Promise(function(resolver,reject){
        task.find(queryStatement,function(err, task){
            if(err){
                reject(err);
                return;
            }
            if(!task || task.length === 0){
                reject('no this task');
                return;
            }
            resolver(task);
        })
    });
};
module.exports = querylib;