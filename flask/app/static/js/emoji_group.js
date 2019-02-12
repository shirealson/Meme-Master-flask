var result_array = new Array();
function create_emojiGroup(cate_object){
    var new_Object = {
        group_id : cate_object.category,
        group_cn_name : cate_object.category_cn_name,
        group_loaded_group : 0,
        group_loaded_index : 0,
        eachUpdateNum : 10,
        total_img_num : cate_object.num,
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

