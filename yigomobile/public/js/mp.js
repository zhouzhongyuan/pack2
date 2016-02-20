$(document).ready(function(){
        "use strict";
        $('button').on('click',function(e){
            submitTask();
        })
    }
);
function submitTask(){
    var data = $('form#mpAddForm').serializeObject();
    console.log(data);
    var config = {
        url:'api/mp',
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