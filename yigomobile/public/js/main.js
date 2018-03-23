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
    data.freemem = parseInt(data.freemem/1000000, 10);
    data.totalmem = parseInt(data.totalmem/1000000, 10);
    var template = "<h5>服务器信息</h5><table class='striped'><tr><td>可用内存</td><td>{{=it.freemem}}MB</td></tr>\
            <tr><td>总内存</td><td>{{=it.totalmem}}MB</td></tr>\
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

    var startTime = new Date(1448441213552);
    var nowTime = new Date();
    var totalDay = parseInt((nowTime - startTime)/(1000*60*60*24), 10);
    data.totalDay = totalDay;
    var template = "<div>我们已经为<em id='totalNumber'>{{=it.total}}</em>个任务打包了！</div><div>我已经运行<em id='totalDay'>{{=it.totalDay}}</em>天了!</div>";
    var tempFn = doT.template(template);
    var html = tempFn(data);

    var taskNum = $('.taskNum');
    taskNum.html(html);
}
