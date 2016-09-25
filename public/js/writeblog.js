  //控制选择的那几个的active的变化
  $('.navbar-nav li').click(function(event) {
    $($('.navbar-nav').find('.active')).removeClass('active');
    $(event.target).addClass('active');
    
    var text = $(event.target).text();
    switch(text){
        case '全部':
        $('.article-item').slideDown('slow');
        break;
        case '已发布':
        $('.article-item[data-flag = 1]').slideDown('slow');
        $('.article-item[data-flag = 0]').slideUp('slow');
        break;
        case '未发布':
        $('.article-item[data-flag = 1]').slideUp('slow');
        $('.article-item[data-flag = 0]').slideDown('slow');
        break;
    }

  });
  
  //响应删除操作
  $('.delete').click(function(event) {
      /* Act on the event */
      var articleid = $(event.currentTarget).attr('data-id');
      $.ajax({
        url:'/myblog',
        type:'delete',
        data:{articleId:articleid},
        success:function(result){
            if(result.opresult == 1){
                $('.article-item[data-id = '+articleid+']').slideUp('slow',function(){
                    $('.article-item[data-id = '+articleid+']').remove();
                });
                swal('信息','删除成功','success');
            }
        }
      });
  });

  $('.new').click(function(event) {
    /* Act on the event */
    $.ajax({
      url:'/blog',
      type:'Post',
      data:{action:'new'},
      success:function(data){
        if(data.valid != 1){
          swal({
            text:"出错啦！"+data.valid,
            type:"warning"
          })
        }else{
        var articleId = data.articleId;
        window.location.href = '/blog?action=edit&articleid='+articleId;
        }
      }
    })
  });

  $('.breif').each(function(index, el) {
    $(el).html("<p style='text-overflow: ellipsis;width:100%; white-space:nowrap;overflow:hidden;'>"+$(el).text()+"</p>");
  });