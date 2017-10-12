$(document).ready(function(){
    var paginationEl = document.getElementsByClassName('pagination')[0];

    getTasks();
    pagination(1);
    setInterval(getTasks,100*1000);
    //alert("网站正在升级中……\n请勿打包\n若情况紧急,请联系QQ 759754385(周中原)")
    //alert("如果打包不成功,请加入QQ群 543503476(app)")
    }
);

//pagination
function pagination (){
    // add all pagination
    function addAllPagination(){
        var config = {
            url:'api/tasks',
            async:false,
            type: 'GET'
        };
        var responseData = $.ajax(config).responseJSON;
        var allPaginationNumber = Math.ceil(responseData.length/10);
        console.log(allPaginationNumber);
        var i = 2;
        var addedPagination = $('#addedPagination');
        do{
            addedPagination.append(`<li class="waves-effect"><a href="#!">${i}</a></li>`);
            i++;
        } while(i <= allPaginationNumber);
    }

    addAllPagination();
    var li = $('.pagination').find('li');
    $.each(li,function(i,v){
        v.addEventListener('click',function(e){
            changePage(e);
        },false);
    })

}
function changePage(e){
  var currentPageNumber = $('.pagination').find('.active').text();
  currentPageNumber = parseInt(currentPageNumber);
  var clickedPageNumber = $(e.target).text();
  var gotoPageNumber;
  if(parseInt(clickedPageNumber) > 0){
    gotoPageNumber = clickedPageNumber;
  }else if(clickedPageNumber == 'chevron_left'){
    gotoPageNumber = currentPageNumber - 1;
  }else if(clickedPageNumber == 'chevron_right'){
    gotoPageNumber = currentPageNumber + 1;
  }
  getTasks(gotoPageNumber);
  changeStyle(gotoPageNumber);
};
function changeStyle(gotoPageNumber){
  var changeLeft = $('.pagination').find('li').first();
  var changeRight = $('.pagination').find('li').last();
  var allLi = $('.pagination').find('li');
  var activeLi;
  $.each(allLi,function(i,v){
     if ($(v).text() == gotoPageNumber){
       activeLi = $(v);
     }
  })
  activeLi.removeClass('waves-effect');
  activeLi.addClass('active');
  activeLi.siblings().removeClass('active');
  if(gotoPageNumber == 1){
    changeLeft.addClass('disabled');
  }else if(gotoPageNumber == 3){
    changeRight.addClass('disabled');
  }else{
    changeLeft.removeClass('disabled');
    changeRight.removeClass('disabled');
    changeLeft.addClass('waves-effect');
    changeRight.addClass('waves-effect');
  }

};
function getTasks(pageNumber){
  console.log('切换到页面：' + pageNumber);
    var pageNumber = pageNumber || 1;
    "use strict";
    var config = {
        url:'api/tasks',
        async:false,
        dataType: 'json',
        data:{
            "pageNumber": pageNumber,
            "tasksPerPage": 10
        },
        type: 'GET'
    };
    var htmlObj = $.ajax(config);
    var data = htmlObj.responseJSON;
    _.each(data, function(v){
        v.startTime = (new Date(v.startTime)).toLocaleString();
        switch (v.status){
            case 'accepted':
                v.status = '打包中';
                break;
            case 'finished':
                v.status = '打包成功';
                break;
            case 'waiting':
                v.status = '等待中';
                break;
            case 'rejected':
                v.status = '打包失败';
                break;
        }
        if(v.appPlatform === 'android'){
            var s = v.apkDownloadLink;
            if(/pack2/.test(s)){
                s = s.match(/(?:pack2)(.*)/)[1];
            }
            v.downloadLink = s;
        }else if(v.appPlatform === 'ios'){
            var link = v.ipaLink;
            if(/pack2/.test(link)){
                link = link.match(/(?:pack2)(.*)/)[1];
            }

            var reg = new RegExp('^(.+)\/(?:[^/]+)$');
            link = reg.exec(link)[1] + '/index.html';
            v.downloadLink = link;
            //v.downloadLink = v.ipaLink;
        }
    });
    var template = "{{~it :value:index}}\
        <tr>\
            <td class='appName' >{{=value.appName}}</td>\
            <td class='appPlatform' > <div class=\"chip red accent-2\">{{=value.appPlatform}}</div></td>\
            <td class='appBuildType' > <div class=\"chip  teal darken-2\">{{=value.appBuildType}}</div></td>\
            <td class='appVersion' > <div class=\"chip  amber lighten-2\">{{=value.appVersion}}</div></td>\
            <td class='startTime' >{{=value.startTime}}</td>\
            <td class='appStatus' ><a href=/yigomobile/public/log/{{=value.id}}.log>{{=value.status}}</a></td>\
            <td class='downloadLink' ><a href={{=value.downloadLink}}>在线安装</a></td>\
            <td class='pack-again' ><a href=/yigomobile/add?taskid={{=value.id}}>再次打包</a></td>\
            <td class='delete-task' ><a class ='delete-task' href='#' apihref=/yigomobile/api/task/{{=value.id}}>删除任务</a></td>\
        </tr>>\
    {{~}}";
    var tempFn = doT.template(template);
    var html = tempFn(data);
    var busy = $('tbody');
    busy.html(html);
    var deleteTasks = $('.delete-task');
    $.each(deleteTasks,function(i,v){
      v.addEventListener('click',function(){
        var url = $(this).attr('apihref');
        var config = {
            url:url,
            async:false,
            type: 'DELETE'
        };
        var htmlObj = $.ajax(config);
      },false)
    })
}
