$(document).ready(function(){
    "use strict";
    $('button').on('click',function(e){
        combinePlugin();
        submitTask();
    })
    $('.modal-trigger').leanModal();

    $('.all-selector').on('click',function(){
        $( ".appPlugin :checkbox" ).attr('checked','checked');
    });
    $('.all-not-selector').on('click',function(){
        $( ".appPlugin :checkbox " ).removeAttr('checked');
    });
    //alert("网站正在升级中……\n请勿打包\n若情况紧急,请联系QQ 759754385(周中原)")
    //alert("如果打包不成功,请加入QQ群 543503476(app)")


    //判断plugin是否checked
    //GET plugin info
    //处理Plugin
    var currentUrl = window.location.href;
    var taskId = currentUrl.match(/\d*$/)[0];
    if (taskId) {
        var queryUrl = `https://dev.bokesoft.com/yigomobile/api/task/${taskId}`;
        $.ajax({
            url:queryUrl,
            success:function (data) {
                console.log(data);
                var pluginListOfAdded = data.appPlugin;

                //为了兼容以前的"cordova-plugin-app-version,cordova-plugin-camera,cordova-plugin-device"类型
                try {
                    pluginListOfAdded = JSON.parse(pluginListOfAdded);
                }catch (e){
                    pluginListOfAdded = pluginListOfAdded.split(',');
                }
                //分离plugin name 和 Variable
                for( var i = 0; i < pluginListOfAdded.length; i++){
                    if (pluginListOfAdded[i].indexOf('?') > -1) {

                        var nameAndVariable = pluginListOfAdded[i].split('?');
                        var Variable = nameAndVariable[1].split('=');
                        pluginListOfAdded[i] = {
                            name:nameAndVariable[0],
                            variable:{
                                key:Variable[0],
                                value:Variable[1]
                            }
                        };

                    }else{
                        pluginListOfAdded[i] = {
                            name:pluginListOfAdded[i]
                        };
                    }
                }
                console.log(pluginListOfAdded);
                //取得页面上所有的plugin
                var pluginListOfPage = $('[name="appPlugin"]');

                for (var i = 0; i < pluginListOfPage.length; i++){
                    var plugin = $(pluginListOfPage[i]).attr('id');
                    //判断是否checked
                    for(var j = 0; j < pluginListOfAdded.length; j++){
                        var customPluginReg = /^https?:\/\/(www\.)?/i;
                        if(customPluginReg.test(pluginListOfAdded[j].name)){
                            $('#cordova-plugin-custom').val(pluginListOfAdded[j].name);
                        }
                        if (plugin === pluginListOfAdded[j].name){
                            //选择
                            $(pluginListOfPage[i]).prop('checked',true);
                            //自动填充Key
                            if (pluginListOfAdded[j].variable){
                                var closestInputName = `${pluginListOfAdded[j].name}_${pluginListOfAdded[j].variable.key}`;

                                var closestInput = $(`[name="${closestInputName}"]`);
                                $(closestInput[0]).val(pluginListOfAdded[j].variable.value);
                            }


                            break;
                        }
                    }
                }


            },
        });



    }






    }
);
function submitTask(){
    var data = $('form#taskAddForm').serializeObject();
    var pluginList = data.appPlugin;
    console.log(data);
    pluginList.forEach(function (item, index) {
        if(!item){
            pluginList.splice(index,1)
        }
        if(item === 'https://github.com/zhouzhongyuan/cordova-plugin-native'){
            pluginList[index] = 'cordova-plugin-native';
        }
    });

    console.log(data);
    var config = {
        url:'api/task',
        async:false,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function(data){
            console.log(data);
        },
        error:function(err){
            "use strict";
            console.log(err);
        }
    };
    $.ajax(config);
}
function combinePlugin(){
  $('.variable-checkbox').each(function(i,v){
      console.log(i,v);
      var pluginName = $(v).find(':checkbox:first').val();
      var pluginVariableAll = $(v).find('[variable-key]')
      $(v).find('[variable-key]').attr('variable-key');
      //遍历所有的variable
      var pluginVariableAllString = [];
      pluginVariableAll.each(function(i,v){
          var key = $(v).attr('variable-key');
          var value = $(v).val();
          var keyValueString = [key,value].join('=');
          pluginVariableAllString.push(keyValueString);
      });
      pluginVariableAllString = pluginVariableAllString.join('&');
      var pluginWithVariable = [pluginName,pluginVariableAllString].join('?');
      console.log(pluginWithVariable);
      $(v).find(':checkbox:first').val(pluginWithVariable);
  });

}
