var result_array = new Array();
function create_emojiGroup(group_id){
    var new_Object = {
        group_id : group_id,
        group_loaded_group : 0,
        group_loaded_index : 0,
        eachUpdateNum : 10,
        total_img_num : 0,
        last_query_state : 0,
        last_query_result : "empty",
        change_group : function(){
            this.group_loaded_group = 0;
            this.group_loaded_index = 0;
            
        },
        query_success : function(){
            this.group_loaded_group += 1;
            this.last_query_state = 200;
        },
    }
    return new_Object;
}

