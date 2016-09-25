;
//编辑器的初始化
    var editor = new wangEditor('editor-trigger');
    // 上传图片
    editor.config.uploadImgUrl = '/wangeditor';
    // 表情显示项
    editor.config.emotionsShow = 'value';

    editor.config.menus = [
    'bold',
    'underline',
    'italic',
    'strikethrough',
    'eraser',
    'forecolor',
    'bgcolor',
    '|',
    'quote',
    'fontfamily',
    'fontsize',
    'head',
    'unorderlist',
    'orderlist',
    'alignleft',
    'aligncenter',
    'alignright',
    '|',
    'link',
    'unlink',
    'table',
    'emotion',
    '|',
    'img',
    'video',
    'location',
    'insertcode',
    '|',
    'undo',
    'redo',
    'fullscreen'
     ];

    editor.create();


//在上传图片的时候要加一个保护机制
$('.file').change(function(event) {
    var fileobj = $('.file').prop('files')[0];
    console.log(fileobj);

    var form = new FormData();
    form.append('file',fileobj);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        imgUrl = xhr.responseText;
        console.log(imgUrl);
        $('.article-edit-cover-img').attr('src',imgUrl);
    }        
    xhr.open("post",'/wangeditor', true);
    xhr.send(form);

   //拿到图片路径之后
});

//articleId 放在了query里面
function getArticles(){
    var articles = {};
    articles.articleTitle = $('.article-edit-title').val();
    articles.articleContent = editor.$txt.html();
    articles.articleImg =  $('.article-edit-cover-img').attr('src');
    articles.publicTime = new Date().getTime();

    return articles;
}

function mywal(valid,successinfo,falilinfo){

        if(valid == 1){
            swal({
                title:"信息",
                text:successinfo,
                type:"success"
            });
        }
        else{
            swal({
                title:"信息",
                text:falilinfo,
                type:"warning"
            });
        }//else
}

var articles = {};
$('.save').click(function(event){
        articles = getArticles();
        
        $.ajax({
            url:"/blog"+window.location.search,
            type:"Post",
            data:{
               articleTitle:articles.articleTitle,
               articleContent:articles.articleContent,
               articleImg:articles.articleImg,
               publicTime:articles.publicTime,
               articleType:$('input:radio:checked').val(),
               action:"save"},
            success:function(data){
                mywal(data.valid,"保存成功","保存失败，错误码：");
            }
        });
});


$('body').on('click', '.public', function(event) {
    event.preventDefault();
    /* Act on the event */
    articles = getArticles();
    $.ajax({
        url:"/blog"+window.location.search,
        type:"post",
        data:{
               articleTitle:articles.articleTitle,
               articleContent:articles.articleContent,
               articleImg:articles.articleImg,
               publicTime:articles.publicTime,
               articleType:$('input:radio:checked').val(),
               action:"public"
             },
        success:function(data){
            mywal(data.valid,"发布成功","发布失败,错误码:");
            $('.public h4').text('取消发布');
            $('.public').addClass('nopublic');
            $('.public').removeClass('public');
        }
      }
    )
});

$('body').on('click', '.nopublic', function(event) {
    articles = getArticles();
    $.ajax({
        url:"/blog"+window.location.search,
        type:"post",
        data:{action:"nopublic"},
        success:function(data){
            mywal(data.valid,"取消发布成功","取消发布失败，错误码:");
            $('.nopublic').addClass('public');
            $('.nopublic h4').text('发布文章');
            $('.nopublic').removeClass('nopublic');
        }
    })
});

