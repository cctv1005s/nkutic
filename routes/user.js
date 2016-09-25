var posts = require('../tools/posts');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var cheerio = require('cheerio');

var setting = require('../config/setting');
var mysql = require('../modules/db.js');
var sql;

var models = require('../models');
var collect = models.collect,
    user = models.user,
    blog = models.blog;

exports.getUser = function(req,res,next){
   var userId = req.params.userid;

    ep.all('userinfo','particles','collectinfo',function(userinfo,particles,collectinfo){
        res.render('user',{user:req.userinfo,
                          userinfo:userinfo,
                          particles:particles,
                          collectinfo:collectinfo
                          });
    });

    user.getUserById(userId,function(err,result){
        if(err){next(err);}
        else{
            ep.emit('userinfo',result);
        }
    });
    blog.getBlogByUserId(userId,function(err,result){
        if(err){next(err);}
        else{

           result = posts.getPublicArticles(result);
           result = posts.getArticlesBreif(result);
           ep.emit('particles',result);
        }
    });
    //收藏的文章肯定都不会是已经被删除了的
    collect.getCollectByUserId(userId,function(err,result){
        if(err){next(err);console.log(err);}
        else{
           result = posts.getArticlesBreif(result);
           ep.emit('collectinfo',result);
        }
    });
}

//用户普通信息的修改
exports.getSetting = function(req,res,next){
    var userId = req.params.userid;
    if(userId != req.session.user.userId && !posts.isAdmin(userId)){
        return res.redirect('/login');
    }

    ep.all('userinfo',function(userinfo){
        res.render('setting',{
                            user:req.userinfo,
                            userinfo:userinfo
                            });
    });

    user.getUserById(userId,function(err,result){
        if(err){console.log(err);next(err);}
        else{
            ep.emit('userinfo',result);
        }
    });
}


exports.postSetting = function(req,res,next){
    var userId = req.params.userid;
    var rebreif = req.body.rebreif
        imgUrl = req.body.imgUrl;

    var attrlist = [],vallist = [];
    if(rebreif != "")
        attrlist.push('userBreif'),vallist.push(rebreif);
    if(imgUrl != "")
        attrlist.push('userImg'),vallist.push(imgUrl);

    if(imgUrl ==""&& rebreif =="")
        return res.redirect(req.originalUrl);

    if(userId != req.session.user.userId && !posts.isAdmin(userId)){
        return res.redirect('/login');
    }
    user.updateUserById(userId,attrlist,vallist,function(err,result){
        if(err){next(err);console.log(err);}
        else{
            console.log(result);

            res.redirect(req.originalUrl);
        }
    });
};

exports.getPasswordSetting = function(req,res,next){
    var userId = req.params.userid;
    if(userId != req.session.user.userId && !posts.isAdmin(userId)){
        return res.redirect('/login');
    }

    res.render('setting-password',{user:req.userinfo,error:null});
}

exports.postPasswordSetting = function(req,res,next){
    var userId = req.params.userid;
    var newpassword = req.body.newpassword,
        renewpassword = req.body.renewpassword,
        password = req.body.password;

    if(userId != req.session.user.userId && !posts.isAdmin(userId)){
        return res.redirect('/login');
    }

    if(newpassword == ""){
       return res.render('setting-password',{error:"密码不能为空",user:req.userinfo});
    }

    if(newpassword != renewpassword){
        return res.render('setting-password',{error:"两次密码不一样",user:req.userinfo});
    }

    user.getUserById(userId,function(err,result){
       var realpassword =  result[0].userPassword;
       if(err){next(err);console.log(err);}
       else{
        if(realpassword != password){
           return res.render('setting-password',{error:"现在密码输入错误",user:req.userinfo});
        }
        else{
            user.updateUserById(userId,['userPassword'],[newpassword],function(err,result){
                if(err){next(err);console.log(err);}
                else{
                    return res.render('setting-password',{error:"密码修改成功",user:req.userinfo});
                }
            });
        }
       }
    });
}

exports.getCollect = function(req,res,next){
    var userId = req.params.userid;

    if(typeof userId == 'undefined'){
        userId = req.session.user.userId;
        console.log(userId);
    }

    ep.all('collectinfo',function(collectinfo){
       res.render('collect',{user:req.userinfo,collectinfo:collectinfo});
    });
    //收藏的文章肯定都不会是已经被删除了的
    collect.getCollectByUserId(userId,function(err,result){
        if(err){next(err);console.log(err);}
        else{
           result = posts.getArticlesBreif(result);
           ep.emit('collectinfo',result);
        }
    });
}


exports.postCollect = function(req,res,next){

};

