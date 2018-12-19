window.onload=function(){
    var data = {'data': [
{'src' : "/static/img/0a3dcb8f9f349f11b8046c97afb698e373abcb20.jpg"},
{'src' : "/static/img/0a3dcb8f9f349f11b8046c97afb698e373abcb20.jpg"},
{'src' : "/static/img/0a3dcb8f9f349f11b8046c97afb698e373abcb20.jpg"},
{'src' : "/static/img/0a3dcb8f9f349f11b8046c97afb698e373abcb20.jpg"}]};

    window.onscroll=function(){
        if(checkBottom()){
            updatePage(data);
        }
    };
    
};
function updatePage(imageSet){
    main_board = document.getElementsByClassName('main_board')[0];
    imageSet_length = imageSet.data.length;
     if (imageSet_length % 4 == 0){
         row_num = imageSet_length / 4;   
     }
     else{
        row_num = imageSet_length / 4 + 1; //获得一共有多少排
     }
     for(var i=0;i<row_num;i++){
        var new_row = document.createElement('div');
        new_row.className = 'row';
            for(var j=0;j<4;j++){
                if (i * 4 + j >= imageSet_length){
                    break;
                }//为了处理最后一排的情况
                var new_col = document.createElement('div');
                new_col.className = 'col-md-3';
                var new_card = document.createElement('div');
                new_card.className = 'card shadow';
                //card-img
                var new_img = document.createElement('img');
                new_img.className = 'card-img-top';
                new_img.src = imageSet.data[i * 4 + j].src;
                new_card.append(new_img);
                //card-body
                var new_card_body = document.createElement('div');
                new_card_body.className='card-body';
                var new_h5 = document.createElement('h5');
                new_h5.textContent = "表情包";
                var new_link = document.createElement('a');
                new_link.href = '#';
                new_link.text = '复制到剪切板';
                new_card_body.append(new_h5);
                new_card_body.append(new_link);
                //----
                new_card.append(new_card_body);
                new_col.append(new_card);
                new_row.append(new_col);


            }
        /*
        var newBox=document.createElement("div");
		newBox.className="box";
		main.appendChild(newBox);
		var newpic=document.createElement("div");
		newpic.className="pic";
		newBox.appendChild(newpic);
		var newimg=document.createElement("img");
		newimg.src="./images/"+dataInt.data[i].src;
        newpic.appendChild(newimg);
        */
       main_board.appendChild(new_row);
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

