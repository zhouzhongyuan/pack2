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
        url:'api/tasks',
        async:false,
        type: 'GET'
    };
    var responseData = $.ajax(config).responseJSON;
    _.each(responseData, function(v){
        v.startTime = (new Date(v.startTime)).toLocaleString();
    });
    var count = _.countBy(responseData, 'status');
    var data = {
        total:responseData.length || 0,
        finished:count.finished || 0,
        waiting:count.waiting || 0,
        accepted:count.accepted || 0,
    };
    if(data.accepted !== 0){
        //data.showAccepted = true;
        data.acceptedTask = _.where(responseData, {status: "accepted"})[0];
    }
    var template = "<h5>任务信息</h5><table class='striped'><tr><td>任务总数</td><td>{{=it.total}}</td></tr>\
                    <tr><td>已完成的任务</td><td>{{=it.finished}}</td></tr>\
                    <tr><td>等待中的任务</td><td>{{=it.waiting}}</td></tr>\
                    <tr><td>处理中的任务</td><td>{{=it.accepted}}</td></tr></table>\
                    {{? it.acceptedTask }}正在处理的任务为:<tr><td>{{=it.acceptedTask.appName}}</td><td>提交时间为:{{=it.acceptedTask.startTime}}</td></tr>{{?}}";
    var tempFn = doT.template(template);
    var html = tempFn(data);

    var taskNum = $('.taskNum');
    taskNum.html(html);
}