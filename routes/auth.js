var posts = require('../tools/posts');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var cheerio = require('cheerio');
var setting = require('../config/setting');
var path = require('path');
var mysql = require('../modules/db.js');
var sql;


exports.getLogin = function(req,res,next){
    // 如果用户已经登陆
    if(posts.getUser(req)){
        res.redirect('/');
    }
    else{//如果没有登陆
            res.render('login',{setting:setting,user:req.userinfo});
    }
};

exports.postLogin = function(req,res,next){
    ep.all('user',function(user){
    //如果是空
        if(user == null){
            res.json({
                valid:false
            })
        }
        else{
    //保存session
            req.session.user = user;
            res.json({
                valid:true
            })
        }
    });

    posts.checkUser({username:req.body.username,password:req.body.password},function(err,user){
        if(err){
            // 抛出异常
            console.log(err);
        }
        ep.emit('user',user);
    })
};

// 注册

exports.getRegister = function(req,res,next){
    
        res.render('register',{user:req.userinfo});
}

exports.postRegister = function(req,res,next){

    var userName = req.body.userName,
        userNick = req.body.userNick,
        userPassword = req.body.passWord;

    sql = "select Max(userId) as maxUserId from nkuticweb.userinfo";
    mysql.query(sql,function(err,result){
        if(err){
            next(err);
        }
        else{
            userId = result[0].maxUserId + 1;
            console.log(result);
            sql = "INSERT INTO nkuticweb.userinfo (userinfo.userId,userinfo.userName,userinfo.userNick,userinfo.userPassword) VALUES (?,?,?,?);"
            userinfo = [userId,userName,userNick,userPassword];
            console.log(userinfo);

            mysql.query(sql,userinfo,function(err,result){
                if(err){
                    res.json({valid:false});
                    console.log(err);
                }
                else{
                    res.json({valid:true});
                }
            })
        }
    });
}

exports.getLogout = function(req,res,next){
    req.session.user = null;
    res.send('<script> window.history.go(-1);</script>');
}

