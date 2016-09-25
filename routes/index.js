var express = require('express');
var router = express.Router();

var posts = require('../tools/posts')
var eventproxy = require('eventproxy');
var setting = require('../config/setting');
var ep = new eventproxy();
var mysql = require('../modules/db');

var models = require('../models');
var blog = models.blog;

/* GET home page. */

exports.index = function(req, res, next) {

//缓存并不能实时更新，实时更新的只有数据库，缓存只能告诉你你是不是登录着的
  ep.all('articles',function(articles){
    // 整合msginfo和userinfo
    res.render('index',{
        articles:articles,
        setting:setting,
        user:req.userinfo
    });
  });

  
  blog.getAllBlogs(function(err,result){
    if(err){console.log(err);next(err);}
    else{
      var temp = [];
      for(var i = 0;i < result.length;i++){
        if(result[i].articleFlag == 1) temp.push(result[i]);
      }
      result = temp;
      for(var i = 0;i < result.length;i++){
        result[i].publicTime = posts.getDate(result[i].publicTime);
      }
      ep.emit('articles',result);
    }
  });
}


router.get('/err',function(req,res,next){
    res.render('error',{user:null,setting:setting});
});




