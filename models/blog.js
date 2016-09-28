var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var sql;

var request = require('request');
var config = require('../config/setting');

exports.getBlogByUserId = function(userid,callback){
    sql = "select * from nkuticweb.articles where ownUserId = "+userid+";";
    mysql.query(sql,callback);
}


exports.getAllBlogs = function(callback){
    this.getBlogByUserId("ownUserId",callback);
}

exports.getBlogByArticleId = function(articleid,callback){
    sql = "select * from nkuticweb.articles where articleId = "+articleid+";";
    mysql.query(sql,callback);
}

exports.getIndexBack = function(cb){
    //必应首页图片
    request(config["bing"],function(err,req,data){
        if(err){
            return cb(err);
        }
        cb(null,getUrl(data));
    });
}

var getUrl = function(data){
    data = JSON.parse(data);
    return data["images"][0].url;
}
