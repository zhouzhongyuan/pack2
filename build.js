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
        task.winston = new (winston.Logger)({ transports: [file] });

        task.winston.info('begin to pack ',task.id);
        tt = task;

        var packIns = pack(task);
        return packIns.build();
    }).then(function(packIns){
        tt.status = "finished";
        tt.save();
        tt.winston.info('pack success');
        busy=false;
    }).catch(function(e,winston){
        tt.status = "rejected";
        tt.save();
        var path = require('path');
        var appDir = path.dirname(require.main.filename);
        process.chdir(appDir);
        //清空working

        tt.winston.info('错误如下：');
        var err = e.toString();
        console.log(err)
        tt.winston.info(err);
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
