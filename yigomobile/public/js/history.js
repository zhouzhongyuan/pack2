$(document).ready(function(){
    getTasks();
    pagination(1);
    setInterval(getTasks,100*1000);
    }
);

//pagination
function pagination (){
    "use strict";
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
    });
    var template = "{{~it :value:index}}\
        <tr>\
            <td>{{=value.appName}}</td>\
            <td>{{=value.startTime}}</td>\
            <td>{{=value.status}}</td>\
            <td><a href={{=value.apkDownloadLink}}>apk下载</a></td>\
            <td><a href=/yigomobile/add?taskid={{=value.id}}>再次打包</a></td>\
            <td><a class ='delete-task' href='#' apihref=/yigomobile/api/task/{{=value.id}}>删除任务</a></td>\
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
