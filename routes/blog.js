var posts = require('../tools/posts');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var cheerio = require('cheerio');
var setting = require('../config/setting');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var models = require('../models');
var blog = models.blog,
    collect = models.collect;

var mysql = require('../modules/db.js');
var sql;


exports.getMyblog = function(req,res,next){

    var userid = req.session.user.userId;
        // 通过userid 与 session 中的 id 对比确定是同一人
    if(req.query.userid != req.session.user.userId)
    res.redirect('/myblog?userid=' + req.session.user.userId);

    ep.all('articles',function(articles){
            res.render('writeblog',{setting:setting,articles:articles,user:req.userinfo});
    });

    blog.getBlogByUserId(userid,function(err,result){
        if(err){next(err);}
        else{
            //将信息处理
            var temp = [];
            for(var i = 0;i < result.length;i++){
                if(result[i].articleFlag != 3){
                    temp.push(result[i]);
                }
            }
            result = temp;
            for(var i = 0;i < result.length;i++){
                result[i].publicTime = posts.getDate(result[i].publicTime);
                var $ = cheerio.load(result[i].articleContent);
                result[i].articleContent = $('p').text().substr(0,10);
            }
            ep.emit('articles',result);
        }
    });
};


exports.deleteMyblog = function(req,res,next){
    if(req.session.user){
    var articleId = req.body.articleId;
    var sql = "UPDATE nkuticweb.articleinfo SET articleFlag = 3 WHERE articleId = "+articleId+"";
    mysql.query(sql,function (err,result) {
        if(err){
            console.log(err);
            next(err);
            res.json({opresult:0});
        }
        else{
            res.json({opresult:1});
        }
    })
    }
    else{
        res.json({opresult:0})
    }
};


exports.getBlog = function(req,res,next){
    var action = req.query.action,
        articleid = req.query.articleid;

    if(action == 'show'){ 
        
        ep.all('articles','collectinfo',function(articles,collectinfo){
            res.render('showblog',{
                user:req.userinfo,
                articles:articles,
                collectinfo:collectinfo
            });
        });
   
        if(req.session.user){
            console.log(req.session.user);
            var userid = req.session.user.useId;
            collect.getCollectByUserIdAndArticleId(userid,articleid,function(err,result){
                if(err){next(err);console.log(err);}
                else{
                    ep.emit('collectinfo',result);
                }
            });            
        }
        else{
           ep.emit('collectinfo',[]); 
        }

    }
    if(action == 'edit'){
        ep.all('articles',function(articles){
            if(req.session.user){
                if(req.session.user.userId != articles[0].ownUserId){
                    res.redirect('/login');
                }else{
                    res.render('editblog',{articles:articles,user:req.userinfo});   
                }                 
            }
            else{
                res.redirect('/login');
            }
        });
    }

    blog.getBlogByArticleId(articleid,function(err,result){
        if(err){console.log(err);next(err);}
        else{
            result = posts.getRealArticles(result);
            ep.emit('articles',result);
        }
    });
}

exports.postBlog = function(req,res,next){

    if(!posts.getUser(req))
    {
        res.redirect('/login');

    }
    else
    {
        var userId = req.session.user.userId;

        var articleId = req.query.articleid;
        console.log(req.query);
        var action = req.body.action;
        console.log(req.body);
        if(action!='nopublic'){
            var articleTitle = req.body.articleTitle,articleContent = req.body.articleContent,articleImg = req.body.articleImg,publicTime =  req.body.publicTime,articleType=req.body.articleType;
        }

        switch(action){
            case "save":

            var sql = "update nkuticweb.articleinfo set articleTitle = '"+articleTitle+"' ,articleContent = '"+articleContent+"',articleImg = '"+articleImg+"',publicTime = "+publicTime+" ,articleType = "+articleType+"  where articleId = "+articleId;
            console.log(sql);
            mysql.query(sql,function(err,result){
                if(err){
                    next(err);
                    console.log(err);
                }
                else{
                    res.json({valid:1});
                }
            })

            break;
            case "public":

            var sql = "update nkuticweb.articleinfo set articleTitle = '"+articleTitle+"' ,articleContent = '"+articleContent+"',articleImg = '"+articleImg+"',publicTime = "+publicTime+" ,articleType = "+articleType+"  where articleId = "+articleId;
            mysql.query(sql,function(err,result){
                if(err){
                    next(err);
                    console.log(err);
                }
                else{
                    res.json({valid:1});
                }
            })
            break;

            case "nopublic":
            var sql = "update nkuticweb.articleinfo set articleFlag = 0 where articleId = "+articleId;
            mysql.query(sql,function(err,result){
                if(err){
                    next(err);
                    console.log(err);
                }
                else{
                    res.json({valid:1});
                }
            })
            break;
            case "new":
            var sql = "select Max(articleId) as articleId from nkuticweb.articleinfo ";

            mysql.query(sql,function(err,result){
                if(err){
                    next(err);
                    console.log(err);
                }
                //当数据库一篇文章都没有的时候
                var newarticleId;
                if(result.length == 0){
                    newarticleId = userId + ''+ 0 ;
                }
                var newpublicTime = new Date().getTime();
                newarticleId = result[0].articleId + 1;//
                sql = "insert into nkuticweb.articleinfo (articleTitle,articleContent,articleId,ownUserId,publicTime) values (?,?,?,?,?)";
                var newarticleinfo = ["","",newarticleId,userId,newpublicTime];
                mysql.query(sql,newarticleinfo,function(err,result){
                    if(err){
                        next(err);
                        console.log(err);
                        res.json({valid:0});
                    }
                    else{
                        res.json({articleId:newarticleId,valid:1});
                    }
                });

            });//mysql
            break;
        }
    }
}

