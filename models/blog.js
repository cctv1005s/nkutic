var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var sql;


/*
根据userid得到文章
*/
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