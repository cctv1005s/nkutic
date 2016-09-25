var express = require('express');
var course = express.Router();
var posts = require('../tools/posts');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var tools = require('./getCourse')


var setting = require('../config/setting');
var mysql = require('../modules/db.js');
var sql;

course.get('/course',function(req,res,next){

    var pagenum = req.query.pagenum;
    console.log(pagenum);
    ep.all('userinfo','course',function(userinfo,course){
        res.render('course',{user:req.userinfo,setting:setting,course:course});
    })

    ep.all('imooc','shiyan','mycourse',function(imooc,shiyan,mycourse){
        for(var i = 0;i <shiyan.length ;i++){
          imooc.push(shiyan[i]);
        }
        for(var i = 0;i <mycourse.length ;i++){
          imooc.push(mycourse[i]);
        }
        ep.emit('course',imooc);
    })

    tools.getCourse('imooc',pagenum,function(err,result){
      if(err){
        console.log(err);
        next(err);
      }
      else{
        ep.emit('imooc',result);
      }
    })

    tools.getCourse('shiyan',pagenum,function(err,result){
      if(err){
        console.log(err);
        next(err);
      }
      else{
        ep.emit('shiyan',result);
      }
    })

    sql = "select * from nkuticweb.courseinfo";
    mysql.query(sql,function(err,result){
      if(err){
        console.log(err);
        next(err);
      }
      else{
        ep.emit('mycourse',result);
      }
    })



    //这个是guidebar的东西，不用管它。
    if(req.session.user){
        var userid = req.session.user.userId;
        var sql;
        sql = 'select userImg ,COUNT(*) as unMsgNum from nkuticweb.userinfo,nkuticweb.msginfo where userId = '+ userid +' and msgOwnId = '+userid+' and readFlag = 0';//选出未阅读的消息
        mysql.query(sql,function(err,result){
          if(err){
            console.log(err);
            next(err);
          }
          else{
            ep.emit('userinfo',result);
          }
        });
    }
    else{
        ep.emit('userinfo',null);
    }
});

module.exports = course;