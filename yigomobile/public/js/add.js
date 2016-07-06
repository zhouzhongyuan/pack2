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
    }
);
function submitTask(){
    var data = $('form#taskAddForm').serializeObject();
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
