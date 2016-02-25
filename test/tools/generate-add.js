var fs = require('fs');
var obj;
var fileName = '../../plugin/package.json';
var result = new String();
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var keys = Object.keys(obj.dependencies);
    var length = keys.length;
    for(var i =0;i<length;i++){
        result += "p\n"
            + "    input(type='checkbox' name='appPlugin' class='filled-in' value='"+keys[i]+"' id='"+keys[i]+"' checked='checked')\n"
            + "    label(for='"+keys[i]+"') "+keys[i]+"\n";

    };
    console.log(result);
});

//
//p
//    input(type='checkbox' name='appPlugin' class='filled-in' value='../plugin/org.apache.cordova.geolocation' id='org.apache.cordova.geolocation' checked='checked')
//    label(for='org.apache.cordova.geolocation') org.apache.cordova.geolocation（定位）
