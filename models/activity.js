var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var sql;


exports.getActById = function(id,callback){
    sql = "select * from nkuticweb.articles where  articleType=2 and articleFlag <>3 and articleId=" + id;
    mysql.query(sql,callback);
}


exports.getAllActs = function(callback){
    this.getActById('articleId',callback);
}