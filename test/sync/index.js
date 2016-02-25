
var time = 1000;
var url = 'https://dev.bokesoft.com/yigomobile/add?taskid=1456298051000';
function success(){
    "use strict";
    console.log('success.');
}
function error(){
    "use strict";
    console.log('error')
}
function test(){
    "use strict";
    $.ajax({
        type: 'GET',
        url: url,
        success: success,
        error:error
    });
}
var intervalTest = setInterval(test,time);