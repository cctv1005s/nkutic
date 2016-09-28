var express = require('express');
var router = express.Router();

var posts = require('../tools/posts')
var eventproxy = require('eventproxy');
var setting = require('../config/setting');
var ep = new eventproxy();
var mysql = require('../modules/db');

var models = require('../models');
var blog = models.blog;


exports.index = function(req, res, next) {

  ep.all('articles','background',function(articles,url){
    res.render('index',{
        articles:articles,
        setting:setting,
        user:req.userinfo,
        background:url
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

  //获取首页图片
  blog.getIndexBack(function(err,data){
      ep.emit('background',data);
  });

}


router.get('/err',function(req,res,next){
    res.render('error',{user:null,setting:setting});
});




