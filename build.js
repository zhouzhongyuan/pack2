'use strict';
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/koa-app-ios'); // connec
//TODO 1.修改对应的数据库 form koa-app-ios to koa-app
var appConfig  = require('./models/task');
var pack = require('cordovabuild');

var busy = false;

var findTask = function(){
    return new Promise(function(resolver,reject){
        appConfig.find({ status: 'waiting' }, function(err, bears) {
            if(err){
                reject(err);
            }
            if(bears.length==0){
                reject('no task');
            }
            resolver(bears[0]);
        })
    })
}

function monitor(){
    console.log('start monitor loop');
    if(busy)
        return;
    var tt = null;
    findTask().then(function(task){
        busy=true;
        tt = task;
        task.status = "accepted";
        task.save();
        var packIns = pack(task);
        return packIns.build();
    }).then(function(packIns){
        console.log('done');
        tt.status = "finished";
        tt.save();
        busy=false;
    }).catch(function(e){
        tt.status = "rejected";
        tt.save();
        console.error('错误如下：');
        console.error(e);
        busy=false;
    });
}

var buildInterval =null;// setInterval(monitor,20*1000);

module.exports= {
    start : function () {
        monitor();
        buildInterval = setInterval(monitor, 20 * 1000);
    },
    stop:function(){
        clearInterval(buildInterval);
    },
    isBusy:function(){
        return busy;
    }
}
