//var gzw = {
//    "baseSvn": "http://dev.bokesoft.com:9202/svn/mUI/trunk/www/",
//    "projectSvn": "http://dev.bokesoft.com:9202/svn/mUI/trunk/www/js/lib/gzw/",
//    "projectSvnUser":"zhouzy",
//    "projectSvnPassword":"zhouzy",
//    "appName": "国资委",
//    "appEnglishName": "NJGZW",
//    "appDescription": "南京国资委OA",
//    "appIcon": "www/js/lib/gzw/img/icon.png",
//    "appContent": "index.html",
//    "appPlugin":[
//        "../plugin/cordova-plugin-file",
//        "../plugin/cordova-plugin-geolocation",
//        "../plugin/cordova-plugin-device"],
//    "appPlatform": "android",
//    "appPackageName": 'com.bokesoft.gzw'
//};
var gzw = {
    "baseSvn": "http://dev.bokesoft.com:9202/svn/mUI/trunk/www/",
    id: '1449627107000',
    projectSvn: 'http://dev.bokesoft.com:9202/svn/mUI/trunk/www/js/lib/gzw/',
    appVersion: '1.1.1',
    appName: '移动办公',
    appPackageName: 'com.bokesoft.gzw',
    appDescription: '',
    appIcon: 'www/js/lib/gzw/img/icon.png',
    appContent: 'index.html',
    appPlugin: '../plugin/com.cmpsoft.mobile.plugin.pushnotification,../plugin/com.phonegap.plugins.barcodescanner,../plugin/cordova-plugin-whitelist,../plugin/nl.x-services.plugins.socialsharing,../plugin/org.apache.cordova.camera,../plugin/org.apache.cordova.file-transfer,../plugin/cordova-plugin-file-opener2,../plugin/org.apache.cordova.inappbrowser,../plugin/org.apache.cordova.file',
    appPlugin: "/Users/bokeadmin/project/testWebCompile/cordovabuild/plugin/com.qdc.plugins.baidu.location --variable API_KEY=4z5k9DG1QUIBWF9yEfb4Qho6",
    appPlugin: "../../plugin/com.cmpsoft.mobile.plugin.pushnotification",
    //appPluginOptions:{API_KEY:'4z5k9DG1QUIBWF9yEfb4Qho6'},
    projectSvnUser: 'zhouzy',
    projectSvnPassword: 'zhouzy',
    appPlatform: 'ios',
    appBuildType: 'release',
    status: 'finished',
    apkDownloadLink: 'yigomobile/public/apk/1449627107000/移动办公-debug.apk',
    ipaLink: '../yigomobile/public/ios/0/移动办公-debug.ipa',
    "appIosMp": "136cea00-36c6-49e4-9d6d-bd4032dfe448"
}
var carceo = {
    "baseSvn": "http://dev.bokesoft.com:9202/svn/mUI/trunk/www/",
    id: '1449627107000',
    projectSvn: 'http://dev.bokesoft.com:9202/svn/mUI/trunk/www/js/lib/xiaomao/',
    appVersion: '1.1.1',
    appName: '车掌柜',
    appPackageName: 'com.bokesoft.ceo',
    appDescription: '',
    appIcon: 'www/js/lib/gzw/img/icon.png',
    appContent: 'index.html',
    appPlugin: '../plugin/com.cmpsoft.mobile.plugin.pushnotification,../plugin/com.phonegap.plugins.barcodescanner,../plugin/cordova-plugin-whitelist,../plugin/nl.x-services.plugins.socialsharing,../plugin/org.apache.cordova.camera,../plugin/org.apache.cordova.file-transfer,../plugin/cordova-plugin-file-opener2,../plugin/org.apache.cordova.inappbrowser,../plugin/org.apache.cordova.file',
    appPlugin: '../../plugin/cordova-plugin-whitelist',
    projectSvnUser: 'zhouzy',
    projectSvnPassword: 'zhouzy',
    appPlatform: 'ios',
    appBuildType: 'release',
    status: 'finished',
    apkDownloadLink: 'yigomobile/public/apk/1449627107000/移动办公-debug.apk',
    "appIosMp": "2ba4e0f6-b91f-4b15-a3af-88b0d075660b",
    ipaLink: '../yigomobile/public/ios/1/车掌柜-debug.ipa'


}
var pack = require('cordovabuild');

var co = require('co');
co(function*(){
    "use strict";
    var packInstance =  pack(gzw);
    yield packInstance.build();

    var packCarceo =  pack(carceo);
    yield packCarceo.build();
}).then(function(value){
    "use strict";
    console.log(value);
},function(err){
    "use strict";
    console.error(err)
})