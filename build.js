'use strict';
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/koa-app'); // connec
var appConfig  = require('./models/task');
var pack = require('cordovabuild');

var busy = false;

var findTask = function(){
    return new Promise(function(resolve,reject){
        appConfig.find({ status: 'waiting' }, function(err, bears) {
            if(err){
                reject(err);
            }
            if(bears.length==0){
                reject('no task');
            }
            resolve(bears[0]);
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
        task.status = "accepted";
        task.save();

        var winston = require('winston');
        var filename = 'yigomobile/public/log/';
        filename += task.id + '.log';
        var fs = require('fs');
        var stream = fs.createWriteStream(filename);
        var file = new (winston.transports.File)({ stream: stream,    handleExceptions: true,
            humanReadableUnhandledException: true });
        var winston = new (winston.Logger)({ transports: [file] });

        winston.info('begin to pack ',task.id);
        tt = task;

        var packIns = pack(task,winston);
        return packIns.build();
    }).then(function(packIns,winston){
        tt.status = "finished";
        tt.save();
        console.log('pack success');
        busy=false;
    }).catch(function(e,winston){
        tt.status = "rejected";
        tt.save();
        console.log('Error begin,current directory:',process.cwd());
        var path = require('path');
        var appDir = path.dirname(require.main.filename);
        process.chdir(appDir);
        console.log('Error after change,current directory:',process.cwd());
        //清空working

        console.log('错误如下：');
        console.log(e);
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
