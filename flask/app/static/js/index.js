const col_number = 6;//一排有多少列
var col_width = 12 / col_number;
var col_class = "col-md-"+col_width;
var rest_col = 0;//当元素数不能刚好凑够一行时，该变量表示剩下的空列数
var nav_top = 0;
var cates = new Array();//保存着当前页面的分类
var cate_list = new Array();//从服务器获取的分类信息，用以初始化nav-link

var current_cate;//记录当前分类
var imageSet = "empty";
var loading_lock = 0;//加载锁，当正在进行http请求时会将滚动事件锁定
//onload装载事件
window.onload=function(){
    rest_col = 0;//初始化rest_col
    card_num = 0;
    loading_lock = 1;
    nav_top = $(".navbar").offset().top;//初始化导航栏的顶
    initialize(function(){//此处开始为回调函数
    //绑定事件
    window.onscroll=function(){
        if(checkBottom() && loading_lock == 1){
            loading_lock = 0;//锁定事件
            console.log("当前loaded_group" + current_cate.group_loaded_group);
            url = current_cate.search_cate ? 'search/' :'getgroup/';//选择域名
            GET_Request(url + current_cate.group_id + "/" + current_cate.eachUpdateNum * (current_cate.group_loaded_group + 1),
            function(dataJSON){//回调函数
                imageSet = dataJSON.paths;
                updatePage(imageSet);
                loading_lock = 1;//释放事件
                current_cate.query_success();//成功了就增长
                console.log("加载完以后loaded_group" + current_cate.group_loaded_group);
            });
        }
        if (check_nav_top()){
            $(".navbar").addClass("fixed-top");
            
        }
        else{
            $(".navbar").removeClass("fixed-top");
        }
    };
    

    nav_links = $(".nav-link");
    nav_links.each(function(index,element){
        console.log("绑定点击事件" + index)
        $(this).click(function(){
            current_cate = cates[index];
            clear_screen();//清除原有的元素
            current_cate.change_group();
            rest_col = 0;//重置了需要将该值清零
            loading_lock = 0;//锁定滚动时间
            $("#generate_board").css("visibility","hidden");
            console.log("当前loaded_group" + current_cate.group_loaded_group);
            GET_Request("getgroup/" + current_cate.group_id + "/" + current_cate.eachUpdateNum * (current_cate.group_loaded_group + 1),
            function(dataJSON){//回调函数
                current_cate.query_success();//成功了就增长
                imageSet = dataJSON.paths;
                updatePage(imageSet);
                loading_lock = 1;//释放事件锁
                console.log("加载完以后loaded_group" + current_cate.group_loaded_group);
            });
            

        })
    });
    search_btn = $("#search");
    search_btn.click(function(){
        search_content = $("#search_content").val();//获取搜索框内容
        if (search_content == ""){
            alert("请输入内容");
        }
        else{
            new_emoji_group = {
                category : search_content,
                category_cn_name :search_content,
                num : 10 //初始数设为10，获取真正数字以后再改
            };
            search_category = create_emojiGroup(new_emoji_group);
            search_category.search_cate = true;
            current_cate = search_category;
            clear_screen();//清除原有的元素
            current_cate.change_group();
            rest_col = 0;//重置了需要将该值清零
            loading_lock = 0;//锁定滚动时间
            console.log("当前loaded_group" + current_cate.group_loaded_group);
            GET_Request("search/" + current_cate.group_id + "/" + current_cate.eachUpdateNum * (current_cate.group_loaded_group + 1),
            function(dataJSON){//回调函数
                current_cate.query_success();//成功了就增长
                current_cate.total_img_num = dataJSON.num//这个值还不确定叫什么
                imageSet = dataJSON.paths;
                updatePage(imageSet);
                loading_lock = 1;//释放事件锁
                console.log("加载完以后loaded_group" + current_cate.group_loaded_group);
                $("#generate_board").css("visibility","hidden");//设置菜单可见
            });
        }


    });

    });//初始化

    
    
}

function updatePage(imageSet){
    main_board = document.getElementsByClassName('main_board')[0];
    bottom_tip = $("#bottom_tip");
    imageSet_length = imageSet.length;
    if (imageSet_length <= rest_col){//1.第一种情况，数据小于剩余行长度
        rows = main_board.getElementsByClassName('row');
        last_row = rows[rows.length - 1];
        for (var i=0;i<imageSet_length;i++){
            insertCard(last_row,"./static/img/" + imageSet[i][0],'表情包');
        }
        rest_col = rest_col - imageSet_length;//更新rest_col     
    }
    else{//2.第二种情况，数据大于行长度
        //处理剩下的空
        if (rest_col != 0){
            rows = main_board.getElementsByClassName('row');
            last_row = rows[rows.length-1];
            for (var i=0;i<rest_col;i++){
                insertCard(last_row,"./static/img/" + imageSet[i][0],'表情包');
            }
        }
        
        //构建新行
        
        rest_imageSet_length = imageSet_length - rest_col;
        if (rest_imageSet_length % col_number == 0){
            row_num = parseInt(rest_imageSet_length / col_number); //血的教训，一定要记得取整数  
        }
        else{
           row_num = parseInt(rest_imageSet_length / col_number) + 1; //获得一共有多少排
        }
        for(var i=0;i<row_num;i++){
            var new_row = document.createElement('div');
            new_row.className = 'row mt-10';
            //main_board.appendChild(new_row);
            bottom_tip.before(new_row);//在最后一行提示前插入
            for(var j=0;j<col_number;j++){
                if (i * col_number + j >= rest_imageSet_length){
                    break;
                }//为了处理最后一排的情况
                insertCard(new_row,"./static/img/" + imageSet[rest_col + i * col_number + j][0],'表情包');
            }
            
        }
        
        rest_col = col_number - (rest_imageSet_length % col_number);//更新rest_col  
     
       
     }
    
};

function checkBottom(){
    var oParent=document.getElementsByClassName("main_board")[0];
	var Children=oParent.getElementsByClassName("row");//用card的话一直都是0
    var lastcardHeight=Children[Children.length-1].offsetTop;
	var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
	var currentHeight=scrollTop+document.documentElement.clientHeight;
	return (currentHeight>lastcardHeight)?1:0;
};

function insertCard(parent,img_src,title){//parent：父元素对象 img_src : 图片链接 title : 卡片标题
    var new_col = document.createElement('div');
    new_col.className = col_class;
    var new_card = document.createElement('div');
    new_card.className = 'card shadow';
    //card-img
    var new_img = document.createElement('img');
    new_img.className = 'card-img-top';
    new_img.src = img_src;
    new_img.id = "card_img_" + current_cate.group_loaded_index;
    new_card.append(new_img);
    //card-body
    var new_card_body = document.createElement('div');
    new_card_body.className='card-body';
    var new_h5 = document.createElement('h5');
    new_h5.textContent = title;
    var new_link = document.createElement('a');
    new_link.href = "javascript:void(0);";
    new_link.onclick = function(){copy_img(this)};
    new_link.className = "copy_img_link";
    new_link.text = '请在图片上右键选择复制图片';
    new_link.setAttribute("data-clipboard-action","copy");
    new_link.setAttribute("data-clipboard-target","#card_img_" + current_cate.group_loaded_index);//clipboard相关属性分配

    new_card_body.append(new_h5);
    new_card_body.append(new_link);
    
    new_card.append(new_card_body);
    new_col.append(new_card);
    parent.append(new_col);
    current_cate.group_loaded_index  += 1;//更新当前对象的已加载数量
}

function initialize(callback=none){
    //获取nav-link分组信息创建,cates数组
    GET_Request("getrandom",function(dataJSON){
        cate_list = dataJSON
        for(var index = 0;index < JSONLength(cate_list);index++){
            cates[index] = create_emojiGroup(cate_list[index + 1]);//因为cate_list从1开始数起
        }
        //初始化navlink
        nav_link_init(cates);
        current_cate = cates[0];
        current_cate.change_group();
        rest_col = 0;//重置了需要将该值清零
        loading_lock = 0;
        console.log("当前loaded_group" + current_cate.group_loaded_group);
        GET_Request("getgroup/" + current_cate.group_id + "/" + current_cate.eachUpdateNum * (current_cate.group_loaded_group + 1),
        function(dataJSON){//回调函数
            imageSet = dataJSON.paths;
            updatePage(imageSet);
            current_cate.query_success();//成功了就增长
            loading_lock = 1;
            console.log("加载完以后loaded_group" + current_cate.group_loaded_group);       
        });
        callback();//执行回调函数
    })
    
    
}

function copy_img(ele){
    img_object = ele.parentNode.parentNode.getElementsByTagName('img')[0];
    img_object.contentEditable = 'true'; 
    var controlRange; 
    if (document.body.createControlRange) { 
        controlRange = document.body.createControlRange(); 
        controlRange.addElement(img_object); 
        controlRange.execCommand('Copy');
        alert("已经复制到剪切板"); 
    }
    else alert("复制失败，请手动进行复制");
    img_object.contentEditable = 'false'; 
    
} 

function check_nav_top(){
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
    if(nav_top< scrollTop)
        return 1;
    else
        return 0;
}
//发送get请求的函数
function GET_Request(target,call_back){//1.目标 2.回调函数
    var request = new XMLHttpRequest();
	request.open("GET", target);
    request.send();
    var response = new Array();
    response[0] == 0;
	request.onreadystatechange = function() {//此处需要将对象指针传入函数中，否则无法在request的成员函数内操控cate对象
	    if (request.readyState===4) {
            
            if (request.status===200) {
				data = request.responseText;
                dataJSON = JSON.parse(data);
                call_back(dataJSON);
            }
                
        }
    };
}

function JSONLength(obj) {  
  
    var size = 0, key;  
      
    for (key in obj) {  
      
        if (obj.hasOwnProperty(key)) size++;  
      
    }  
      
    return size;  
      
};  

function clear_screen(){
    rows = $(".main_board .row");
    rows.remove();
}

function nav_link_init(cates){
    parent_nav = $(".navbar-nav")[0];
    for(var i = 0;i<cates.length;i++){
        new_nav_link = $("<li class='nav-item'></li>");
        new_a = $("<a class='nav-link'></a>");
        new_a.html(cates[i].group_cn_name);
        new_a.appendTo(new_nav_link);
        new_nav_link.appendTo(parent_nav);
        console.log("创建nav标签")
    }
 
}