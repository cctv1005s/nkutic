var posts = require('../tools/posts');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var setting = require('../config/setting');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var models = require('../models');
var message = models.message;
var mysql = require('../modules/db.js');
var sql;



exports.getMessage = function(req,res,next){
    //在这里暂时不考虑登录的跳转
    ep.all('msginfo',function(msginfo,userinfo){
          res.render('message',{setting:setting,user:req.userinfo,msginfo:msginfo});
    });

    //用户头像，昵称，这条消息的msgId,最近一条消息的时间，最近一条消息的内容，信箱的未读数目，消息的类型
    message.getMailboxByUserId(req.session.user.userId,function(err,result){
        if(err){
            console.log(err);
            next(err);
        }
        else{
            for(var i = 0;i < result.length;i++){
                result[i].lastSendTime = posts.getDate(result[i].lastSendTime);
                $ = cheerio.load(result[i].msgContent);result[i].msgContent = "";
                $('p').each(function(index, el) {
                  result[i].msgContent+=$(el).text();
                });
            }
            ep.emit('msginfo',result);
        }
    });
};


exports.readMsg = function(req,res,next){
  var msgOnId = req.body.msgonid;
  var msgOwnId = req.body.msgownid;

  message.getMailByUserId(msgOwnId,msgOnId,function(err,result){
        if(err){
          next(err);
          console.log(err);
        }
        else{
          res.json({msginfo:result});
        }
     });

    sql = "update nkuticweb.msginfo set readFlag = 1 where msgOwnId = "+msgOwnId+" and msgOnId = "+msgOnId;
    mysql.query(sql,function(err,result){
          if(err){
            next(err);
            console.log(err);
          }
    });
};


exports.deleteMsg = function(req,res,next){
  var msgOnId = req.body.msgonid;
  var msgOwnId = req.body.msgownid;
  sql = "DELETE FROM nkuticweb.msginfo where msgOnId = "+msgOnId+" AND msgOwnId = "+msgOwnId;
  console.log(sql);
  mysql.query(sql,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.json({valid:1});
    }

  });
}


exports.sendMsg = function(req,res,next){

      var newMsgContent = req.body.msgContent;
      var newSendTime = req.body.sendTime;
      var msgOnId = req.body.msgonid;
      var msgOwnId = req.body.msgownid;

      var newMsgId = new Date().getTime()+msgOnId+msgOwnId;

            sql = "insert into nkuticweb.msginfo (sendUser,msgId,msgContent,sendTime,readFlag,msgType,msgOwnId,msgOnId) values (?,?,?,?,?,?,?,?)";

            var msginfo =[msgOwnId,newMsgId,newMsgContent,newSendTime,1,0,msgOwnId,msgOnId];
            console.log(msginfo);

            mysql.query(sql,msginfo,function(err,result){
                if(err){
                  next(err);
                  console.log(err);
                }
                else{

                  sql = "insert into nkuticweb.msginfo (sendUser,msgId,msgContent,sendTime,readFlag,msgType,msgOwnId,msgOnId) values (?,?,?,?,?,?,?,?)";
                  newMsgId = new Date().getTime()+msgOwnId+msgOnId;
                  var othermsginfo =[msgOwnId,newMsgId,newMsgContent,newSendTime,0,0,msgOnId,msgOwnId];



                  mysql.query(sql,othermsginfo,function(err,result){
                      if(err){
                        next(err);
                        console.log(err);
                      }
                      else{
                        sql = "select sendUser,msgId,msgContent,sendTime,readFlag,msgType,msgOwnId,msgOnId,userImg,userNick from nkuticweb.msginfo,nkuticweb.userinfo where msgOwnId = "+msgOwnId+" and userId= sendUser and msgOnId = "+msgOnId+" and msgId = "+ newMsgId;

                          mysql.query(sql,function(err,result){
                              if(err){
                                next(err);
                                console.log(err);
                              }
                              else{
                                res.json({msginfo:result[0]});
                              }
                          });
                        }
                  });

                }
            });

}




