$(document).ready(function(){
    allAjax();
    var intercalAjax = setInterval(allAjax,60*1000);
    }
);
function allAjax(){
    "use strict";
    busyAjax();
    osAjax();
    taskNumAjax();
}
function busyAjax(){
    "use strict";
    var config = {
        url:'api/busy',
        async:false,
        type: 'GET'
    };
    var htmlObj = $.ajax(config);
    console.log(htmlObj);
    var busy = $('.status');
    busy.html(htmlObj.responseJSON.message?'当前状态:<span class="status-busy">忙碌中</span>':'当前状态:<span class="status-free">空闲</span>');
}
function osAjax(){
    "use strict";
    var config = {
        url:'api/os',
        async:false,
        type: 'GET'
    };
    var htmlObj = $.ajax(config);
    var busy = $('.os');
    var data = htmlObj.responseJSON;
    var template = "<h5>服务器信息</h5><table class='striped'><tr><td>可用内存</td><td>{{=it.freemem}}</td></tr>\
            <tr><td>总内存</td><td>{{=it.totalmem}}</td></tr>\
            <tr><td>操作系统</td><td>{{=it.type}}</td></tr></table>";
    var tempFn = doT.template(template);
    var html = tempFn(data);
    busy.html(html);

}
function processAjax(){
    "use strict";
    var config = {
        url:'api/process',
        async:false,
        type: 'GET'
    };
    var htmlObj = $.ajax(config);
    console.log(htmlObj);
    var busy = $('.process');
    busy.html(htmlObj.responseText);
}
function taskNumAjax(){
    "use strict";
    var config = {
        url:'api/taskNumber',
        async:false,
        type: 'GET'
    };
    var responseData = $.ajax(config).responseJSON;
    var data = {
        total:responseData.number || 0,
    };
    var template = "<h5>任务信息</h5><table class='striped'><tr><td>任务总数</td><td>{{=it.total}}</td></tr>";
    var tempFn = doT.template(template);
    var html = tempFn(data);

    var taskNum = $('.taskNum');
    taskNum.html(html);
}
