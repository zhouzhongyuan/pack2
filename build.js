var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/koa-app'); // connec
var taskModel = require('./models/task');
var releaseModel = require('./models/release');

var pack = require('cordova-pack-old').default;

var busy = false;

var findTask = function () {
    return new Promise((resolve, reject) => {
        taskModel.find({status: 'waiting'}, (err, tasks) => {
            if (err) {
                reject(err);
                return;
            }
            if (tasks.length === 0) {
                reject('no task');
                return;
            }
            resolve(tasks[0]);
        })
    })
}

function monitor() {
    console.log('start monitor loop');
    if (busy)
        return;
    var tt = null;
    findTask()
        .then(function (task) {
            console.log('find a task');
            busy = true;
            task.status = "accepted";
            task.save();

            var winston = require('winston');
            var filename = 'yigomobile/public/log/';
            filename += task.id + '.log';
            var fs = require('fs');
            var stream = fs.createWriteStream(filename);
            var file = new (winston.transports.File)({
                stream: stream, handleExceptions: true,
                humanReadableUnhandledException: true
            });
            task.winston = new (winston.Logger)({transports: [file]});

            task.winston.info('begin to pack ', task.id);
            tt = task;
            // return tt;
            var packIns = pack(task);
            return packIns.build();
        }).then(function () {
        tt.status = "finished";
        tt.save();
        tt.winston.info('pack success');
        /*
         * pack success. After that, release
         * */
        if (tt.appRelease) {
            const appPackageName = tt.appPackageName;
            const appPlatform = tt.appPlatform;
            const appVersion = tt.appVersion;
            const appName = tt.appName;
            const serverPath = 'https://dev.bokesoft.com/yigomobile/public/';
            let androidLink = `${serverPath}apk/${tt.id}/${tt.appName}-${tt.appBuildType}.apk`;
            let iosLink = `${serverPath}ios/${tt.id}/index.html`;
            switch (appPlatform) {
                case 'android':
                    var query = {
                        "appName": appName,
                        "appPackageName": appPackageName,
                        "androidVersion": appVersion,
                        "androidLink": androidLink,
                        'androidUpdateTime': new Date(),
                    };
                    break;
                case 'ios':
                    var query = {
                        "appName": appName,
                        "appPackageName": appPackageName,
                        "iosVersion": appVersion,
                        "iosLink": iosLink,
                        'iosUpdateTime': new Date(),
                    };
                    break;
            }
            var saveData = new Promise(function (resolve, reject) {
                releaseModel.find({appPackageName: appPackageName}, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    if (data.length) {
                        //updage
                        releaseModel.findOneAndUpdate({"appPackageName": appPackageName}, query, {new: true}, function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            resolve(data);

                        });
                    } else {
                        //create
                        var newQuery = new releaseModel(query);
                        newQuery.save(function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            resolve(data);
                        });
                    }
                });
            });
            saveData
                .then(function (data) {
                    data = JSON.stringify(data);
                    data = JSON.parse(data);
                    //generater-html
                    var fs = require('fs-extra')
                    var _ = require('underscore');
                    fs.readFile('release/index.html', 'utf8', function (err, html) {
                        function getLocalTime(date) {
                            var a = new Date(date);
                            const year = a.getFullYear();
                            const month = a.getMonth() + 1;
                            const day = a.getDate();
                            return [year, month, day].join('-')
                        }

                        var compiled = _.template(html);
                        if (data.androidUpdateTime) {
                            const temp = getLocalTime(data.androidUpdateTime);
                            data.androidUpdateTime = temp.toString();

                        }
                        if (data.iosUpdateTime) {
                            const temp = getLocalTime(data.iosUpdateTime);

                            data.iosUpdateTime = temp.toString();
                        }
                        var QRCode = require('qrcode');
                        const pageUrl = `${serverPath}release/${data.appPackageName}/index.html`;
                        QRCode.toDataURL(pageUrl, function (err, url) {
                            if (err) {
                                console.log(err);
                                return err;
                            }
                            data.url = url;
                            const result = compiled(data);
                            fs.outputFile(`yigomobile/public/release/${data.appPackageName}/index.html`, result, (err) => {
                                if (err) {
                                    console.log(err);
                                    return err;
                                }
                                console.log("The file was saved!");
                            });
                        });
                    })
                })
        }
        busy = false;
    }).catch(function (e, winston) {
        if(tt){
            tt.status = "rejected";
            tt.save();
            var path = require('path');
            var appDir = path.dirname(require.main.filename);
            process.chdir(appDir);
            //清空working
            tt.winston.info(`进入文件夹${process.cwd()}`);
            tt.winston.info('错误如下：');
            var err = e.toString();
            console.log(err)
            tt.winston.info(err);
        }
        busy = false;
        // TODO
        // // 如果遇到Error code 1/2 错误，重启服务器
        // if(/Error code 1/.test(err)){
        //     process.exit(1);
        // }

    });
}

var buildInterval = null;

const packUtil = {
    start: function () {
        monitor();
        buildInterval = setInterval(monitor, 20 * 1000);
    },
    stop: function () {
        clearInterval(buildInterval);
    },
    isBusy: function () {
        return busy;
    }
}
module.exports = packUtil;

packUtil.start();
