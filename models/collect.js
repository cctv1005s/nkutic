var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var sql;


exports.getCollectByUserId = function(userid,callback){
    sql = "select * from nkuticweb.collectarticles where colUserId = "+userid;
    mysql.query(sql,callback);
}

exports.getCollectByUserIdAndArticleId = function(userid,articleid,callback){
    sql ="select * from nkuticweb.collectarticles where colUserId = ? and colarticleid = ?";
    var info = [userid,articleid];
    mysql.query(sql,info,callback);
}