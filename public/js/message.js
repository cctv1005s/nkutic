//控制选择的那几个的active的变化
$('.navbar-nav li').click(function(event) {
$($('.navbar-nav').find('.active')).removeClass('active');
$(event.target).addClass('active');
switch($(event.target).text()){
    case "全部":
        $('.message-list-item').slideDown('slow');
    break;
    case "未读消息":
        $('.message-list-item').each(function(index, el) {
         if($(el).find('badge').text() == ""){

            $(el).slideUp('slow');
         }
         else{
            $(el).slideDown('slow');
         }
        });
    break;
    case "系统消息":
        $('.message-list-item[data-msgtype = 1 ]').slideDown('slow');
        $('.message-list-item[data-msgtype = 0 ]').slideUp('slow');
    break;
    case "用户消息":
        $('.message-list-item[data-msgtype = 0 ]').slideDown('slow');
        $('.message-list-item[data-msgtype = 1 ]').slideUp('slow');
    break;
}

});


//这里应该维护一张表，记录所有的未读消息的数目
var unReadTbl = {};
unReadTbl.unMsgNum = $('.unAllMsgNum');//总的数目
unReadTbl.unUserNum = $('.unUserMsgNum')//用户消息
unReadTbl.unSysNum = $('.unSysMsgNum')//系统消息
unReadTbl.UserList = $('.message-list-item');

unReadTbl.update = function(updateinfo){//更新操作,主要呢，是清零操作用的
    var msgonid = updateinfo.msgonid;
    //清除操作
    $('.message-list-item[data-msgonid='+msgonid+']').find('.badge').text("");

    var unSysNum = 0,unUserNum = 0;
    this.UserList.each(function(index, el) {
        // 先得区分是用户消息还是系统消息
        switch($(el).attr('data-msgtype')){
            case 0://用户消息
                unUserNum += parseInt($(el).find('.badge').text());
            break;
            case 1://系统消息
                unSysNum += parseInt($(el).find('.badge').text());
            break;
        }
    });//each循环结束
    this.unMsgNum.text(unUserNum+unSysNum);
    this.unUserNum.text(unUserNum);
    this.unSysNum.text(unSysNum);
    this.flush();
}

unReadTbl.flush = function(){
    $('.badge').each(function(index, el) {
        if($(el).text() == "0"){
           $(el).text("");
        }
    });
}

unReadTbl.flush();

var editor = new wangEditor('editor-trigger');
// 上传图片
editor.config.uploadImgUrl = '/wangeditor';
// 表情显示项
editor.config.emotionsShow = 'value';

editor.config.menus = [
'underline',
'strikethrough',
'|',
'link',
'emotion',
'|',
'img',
 ];

editor.create();


function leftBob(left){
    if(left.userImg == null){
        left.userImg = "<%= setting.userImg %>";
    }
    var leftbob = "<div class=\"talk-item talk-from clearfix \"><div class=\"talk-userhead leftArea\"><img class=\"img-circle\" style=\"height: 3em;width: 3em;\" src=\""+left.userImg+"\"></div><div class=\"talk-content leftArea\"><div class=\"left-bob\"><span class=\"left-bob-arrow\"></span><span class=\"left-bob-inner-arrow\"></span>"+left.msgContent+"</div></div></div>";
    return leftbob;
}

function rightBob(right){
    if(right.userImg == null){
        right.userImg = "<%= setting.userImg %>";
    }
    var rightbob = "<div class=\"talk-item talk-send clearfix \"><div class=\"talk-userhead rightArea\"><img class=\"img-circle\" style=\"height: 3em;width: 3em;\" src=\""+right.userImg+"\"></div><div class=\"talk-content leftArea\"><div class=\"right-bob\"><span class=\"right-bob-arrow\"></span><span class=\"right-bob-inner-arrow\"></span>"+right.msgContent+"</div></div></div>";
    return rightbob;
}


var mymodal = $(".modal");

//打开邮箱
$('.message-list-item').click(function(event) {

    if($(event.target).attr('data-type') != "menubutton"){
        var msgonid = $(event.currentTarget).attr('data-msgonid');
        var msgownid = $(event.currentTarget).attr('data-msgownid');
        new MsgBox(msgownid,msgonid).show();
    }
});

//发送留言
$('.btn-sendmsg').click(function(event) {
    /* Act on the event */
    //检查内容是否为空
    var msgContent = editor.$txt.html();
    if(msgContent == ""){
        swal({title:"内容不能为空！",type:"warning"});
    }
    else{
        var msgonid = $('.modal').attr('data-msgonid');
        var msgownid = $('.modal').attr('data-msgownid');

        //发送一个ajax请求给服务器，并取回自己的头像的地址
        new MsgBox(msgownid,msgonid).send(msgContent);
    }
});

$('.message-delete').click(function(event) {
    /* Act on the event */
    //首先要获取我们要删除谁
    //然后发送一个ajax请求过去将信箱给删掉最后再改变一下那些值
    var msgonid = $(".message-opbox").attr('data-msgonid');
    var msgownid = $(".message-opbox").attr('data-msgownid');
    new MsgBox(msgownid,msgonid).delete();
});

var nowevent ;
$(document).on('click', function(event) {
    /* Act on the event */
    if($(".message-opbox-hidden").length == 0 && event.target != nowevent ){

        $(".message-opbox-wrap").toggleClass('message-opbox-hidden');
    }
});

$('.message-menu').click(function(event) {
    var x = $(event.target).offset().top + $(event.target).height();
    var y = $(event.target).offset().left;
    $(".message-opbox").css({
        top: x,
        left:y,
    });
    $(".message-opbox-wrap").toggleClass('message-opbox-hidden');

    $(".message-opbox").attr('data-msgonid',$(event.target).attr('data-msgonid'));
    $(".message-opbox").attr('data-msgownid',$(event.target).attr('data-msgownid'));

    nowevent = event.target;
});


$('.message-readyet').click(function(event) {
    /* Act on the event */
    //首先要获取我们要已读谁
    //然后发送一个ajax请求过去将信箱里面的信息改变
    //发送数据
    var msgonid = $(".message-opbox").attr('data-msgonid');
    var msgownid = $(el).attr('data-msgownid');

    $.ajax({
        url:"/message/readmsg",
        type:"Post",
        data:{
              msgownid:msgownid,
              msgonid:msgonid
        },
        success:function(data){

            //将视图里面的所有数字更新
            unReadTbl.update({msgonid:msgonid});
            //写入对话框里面
            $(".message-opbox-wrap").toggleClass('message-opbox-open');
        }
    });//ajax
});

$('.message-readallyet').click(function(event) {
    /* Act on the event */
    //首先要获取我们要已读谁
    //然后发送一个ajax请求过去将信箱里面的信息改变
    //发送数据
    $('.message-list-item').each(function(index, el) {
        var msgonid = $(el).attr('data-msgonid');
        var msgownid = $(el).attr('data-msgownid');
        $.ajax({
            url:"/message/readmsg",
            type:"Post",
            data:{
                  msgownid:msgownid,
                  msgonid:msgonid
            },
            success:function(data){

                //将视图里面的所有数字更新
                unReadTbl.update({msgonid:msgonid});
                //写入对话框里面
                $(".message-opbox-wrap").toggleClass('message-opbox-open');
            }
        });//ajax
    });

});

var MsgBox = function(msgownid,msgonid){
    this.msgownid  = msgownid;
    this.msgonid = msgonid;
}

MsgBox.prototype = {

    show:function(){
        var msgonid = this.msgonid,
            msgownid = this.msgownid;

        //将对话框弹出
        $('.modal').modal('show');
        $('.modal').attr('data-msgonid',msgonid);
        $('.modal').attr('data-msgownid',msgownid);


        //发送数据
        $.ajax({
            url:"/message/readmsg",
            type:"Post",
            data:{
                  msgownid:msgownid,
                  msgonid:msgonid
            },
            success:function(data){
                console.log(data);
                //将对话框里面的内容清空
                $(".modal-dialog .modal-body").html('');
                //将标题的内容更新
                $(".talktouser").text($($(event.currentTarget).find('.talktousernick')).text());
                //将视图里面的所有数字更新
                unReadTbl.update({msgonid:msgonid});
                //写入对话框里面
                for(var i = 0;i < data.msginfo.length;i++){
                    if(data.msginfo[i].sendUser == data.msginfo[i].msgOnId){//说明是发消息的人
                        $('.modal-body').append(leftBob(data.msginfo[i]));
                    }
                    else{
                        $('.modal-body').append(rightBob(data.msginfo[i]));
                    }
                }
            }
        });//ajax
    $(".modal-dialog .modal-body").html('加载中....');
    }//show结束
    ,
    delete:function(){
        var msgonid = this.msgonid,
            msgownid = this.msgownid;

        $.ajax({
        url:"/message/deletemsg",
        type:"Post",
        data:{msgownid:msgownid,msgonid:msgonid},
        success:function(data){
            //将视图里面的所有数字更新
            if(data.valid == 1){
                swal("删除成功");
                unReadTbl.update({msgonid:msgonid});
                $('.message-list-item[data-msgonid ='+msgonid+']').slideUp('slow',function(){
                    this.remove();
                })
            }
            else{
                swal({title:"删除失败",type:"warning"});
            }
            $(".message-opbox-wrap").toggleClass('message-opbox-open');
        }
        });//ajax
    },
    send:function(msgContent,callback){
        var msgonid = this.msgonid,
            msgownid = this.msgownid;

        $.ajax({
            url:"/message/sendmsg",
            type:"Post",
            data:{
                msgownid:msgownid,
                msgonid:msgonid,
                msgContent:msgContent,
                sendTime:new Date().getTime()
            },

            success:function(data){
                var newitem = $(rightBob(data.msginfo));
                newitem.hide();
                $('.modal-body').append(newitem);
                newitem.slideDown('slow');
                swal('发送成功');
                editor.clear();
            }
        });
    }
};

