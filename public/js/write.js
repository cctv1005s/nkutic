 var ue = UE.getEditor('editor');
 // $('[data-toggle="popover"]').popover();

var changeClick = function(id,selector,text,toselector){
    var ids = $("[data-id = '"+id+"']");
    $(ids[0]).on('click','[data-toggle="popover"]',function(e){
    $(ids[0]).find('.'+selector).text(text);
    $(ids[0]).find('.'+selector).addClass(toselector);
    $(ids[0]).find('.'+selector).removeClass(selector);
    });
}

var checkUe = function(){
    comfirmFlag = false;
    if(ue.getContent() == null){
        var comfirmFlag = comfirm('真的不打算写内容吗？');
    }
    
    if($('.articleTitle').val() === "" ){
        $('.articleTitle').val("文章标题");
    }

    return true;
}


$('.createArticle').click(function(event) {
    $('.newArticle').each(function(index, el) {
        var id = $(el).attr('data-id');
        changeClick(id,'save','编辑','editor');       
    });

        $.ajax({
            url:'/write',
            type:'Post',
            data:{optype:'new'},
            success:function(data){
            $('.oneditor').removeClass('oneditor');
            var article = '<div class=\"media well newArticle oneditor\" data-id=\"'+data.articleId+'\" ><div class=\"media-left\"><a href=\"#\"  data-placement=\"right\"  data-html=true;  data-toggle=\"popover\" data-content=\'<div class=\"list-group\"><button class=\"list-group-item save\" data-id=\"'+data.articleId+'\"  >保存</button><button class=\"list-group-item public\" data-id=\"'+data.articleId+'\"  >发布</button><button class=\"list-group-item delete\" data-id=\"'+data.articleId+'\"  >删除</button></div>\'><span class=\"glyphicon glyphicon-plus-sign setArticle\" aria-hidden=\"true\"></span></a></div><div class=\"media-body\"><h3>文章标题</h3><p>文章简介</p></div><div class=\"media-right\"></div></div>';
            $('.articleListwaper').append(article);
            $('[data-toggle="popover"]').popover();

            }
        })
    });

    // 保存正在编辑的文章
    var save = function(num,articleid){

        //信息已经完备了
        //操作类型optype
            var optype = 'update';
            $.ajax({
                url:'/write',
                type:'Post',
                data:{
                optype:optype,
                articleId:articleid,
                articleTitle:$('.articleTitle').val(),
                articleContent:ue.getContent(),
                publicTime:new Date().getTime(),
                articleFlag:num
                },
                success:function(data){
                    if(data){
                        history.go(0);
                    }
                }
            });
        };

//保存文章,创建监听器，但是假设一个一篇文章都没有，那么这里也就没有意义了
    $('body').on('click','.save',function(e){  
        if(checkUe())
        save(0,$('.oneditor').attr('data-id'));

    });
    // 场上没有新的文章，只有正在编辑的和非正在编辑的之分
    $('body').on('click','.public',function(event){
            //如果要发布的文章是正在编辑的，那么就检查一次   
            var articleId = $(event.target).attr('data-id');
            var ids = $("[data-id = '"+articleId+"']");
            
            if($(ids[0]).attr('class').indexOf('oneditor') != -1){
                if(checkUe())
                save(0,$('.oneditor').attr('data-id'));
            }else{
                 //如果不是正在编辑的，那么久直接更新就可以了
               $.ajax({
                url:'/writes',
                type:'Post',
                data:{articleId:articleId,opnum:1},
                success:function(data){
                    if(data.valid == true){
                        alert('发布成功');
                        changeClick(articleId,'public','取消发布','nopublic')
                    }
                }
               })
            }
    });
    
    $('body').on('click','.nopublic',function(event){
            //如果要发布的文章是正在编辑的，那么就检查一次   
            var articleId = $(event.target).attr('data-id');
            var ids = $("[data-id = '"+articleId+"']");
        
           $.ajax({
            url:'/writes',
            type:'Post',
            data:{articleId:articleId,opnum:0},
            success:function(data){
                if(data.valid == true){
                    alert('取消发布成功');
                    changeClick(articleId,'nopublic','发布','public');    
                }
        
                        
            }
           })
    });
    //编辑文章
    $('body').on('click','.editor',function(event){
            
            if($('.oneditor').length != 0){
                if(confirm("不打算保存正在编辑的文章了吗？")){
                // 不打算保存了
                $('.oneditor').removeClass('oneditor');
                }else{
                // 打算保存
                save(0,$('.oneditor').attr('data-id'));
                }
            }
            //现在 场上没有正在编辑的文章
            var articleId = $(event.target).attr('data-id');
            //申请编辑的文章
            var ids = $("[data-id = '"+articleId+"']");
            // 添加正在编辑的文章
            $(ids[0]).addClass('oneditor');
            
            $('.oneditor').on('click','[data-toggle="popover"]',function(e){
                $('.oneditor .editor').text('保存');
                $('.oneditor .editor').addClass('save');
                $('.oneditor .editor').removeClass('editor');
            })

            $.ajax(
                {
                    url:'/writet',
                    type:'Post',
                    data:{articleId:articleId},
                    success:function(data){
                        //成功获取内容之后，将文章放入
                        $('.articleTitle').val(data.articleTitle);
                        ue.setContent(data.articleContent);
                        ue.focus(true);
                    }
                });
    });

    $('body').on('click','.delete',function(event){
        var articleId = $(event.target).attr('data-id');
        var ids = $("[data-id = '"+articleId+"']");
        ids.remove();
        $.ajax({
            url:'/write',
            type:'delete',
            data:{articleId:articleId},
            success:function(data){
                if(data){
                    alert("删除成功");
                }
            }
        })
    });