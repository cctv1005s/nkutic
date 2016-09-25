var posts = require('../tools/posts');
var eventproxy = require('eventproxy'); 
var ep = new eventproxy();
var cheerio = require('cheerio');
var setting = require('../config/setting');
var path = require('path');


var models = require('../models');
var user = models.user,
    blog = models.blog,
    message = models.message,
    collect = models.collect,
    activity = models.activity;


var mysql = require('../modules/db.js');
var sql;

exports.getAdmin = function(req,res,next){
    res.redirect('/admin/userlist');
}

exports.userList = function(req,res,next){
    
    ep.all('userlist','actinfo',function(userlist,actinfo){
            res.render('admin',{userlist:userlist,
                                user:req.userinfo,
                                actinfo:actinfo
                               });
    });

    user.getAllUsers(function(err,result){
        if(err){next(err);console.log(err);}
        else{
             ep.emit('userlist',result);
        }
    });

     activity.getAllActs(function(err,result){
        if(err){console.log(err);next(err)}
        else{
            ep.emit('actinfo',posts.getArticlesBreif(result));
        }
    });

}

exports.userDetail = function(req,res,next){
    var userId = req.params.userid;
    
    ep.all('userinfo','articleinfo','messageinfo','collectinfo',function(userinfo,articleinfo,messageinfo,collectinfo){
        res.render('admin-userdetail',{user:req.userinfo,
                                       userinfo:userinfo,
                                       articleinfo:articleinfo,
                                       messageinfo:messageinfo,
                                       collectinfo:collectinfo
                                   });
    });
    //被迫写n层回调，似乎是因为访问得太快了，导致mysql无法跟上
    user.getUserById(userId,function(err,result){
        if(err){next(err);console.log(err);}
        else{
          ep.emit('userinfo',result[0]);

    blog.getBlogByUserId(userId,function(err,result){
        if(err){next(err);console.log(err);}
        else{
            for(var i = 0;i < result.length;i++){
                result[i].publicTime = posts.getDate(result[i].publicTime);
                var $ = cheerio.load(result[i].articleContent);
                result[i].articleContent = $('p').text().substr(0,10);
            }
            ep.emit('articleinfo',result);
     

    message.getMailboxByUserId(userId,function(err,result){
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
            ep.emit('messageinfo',result);
        


    collect.getCollectByUserId(userId,function(err,result){
            if(err){console.log(err);next(err);}
            else{
             ep.emit('collectinfo',result);   
            }     
    });
        }
    });       

        }    
    });

        }    
    });
         
    

};