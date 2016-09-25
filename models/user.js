var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var sql;

exports.getUserById = function(id,callback){
    sql = "select * from nkuticweb.userinfo where userId = "+id+";";
    console.log(sql);
    mysql.query(sql,callback);
}

/**
 * 根据用户ID列表，获取用户信息
 * callback:
 * - err, 数据库异常
 * - result, 邮箱基本信息
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersById = function(ids,callback){
    for(var i = 0;i < ids.length;i++){
        this.getUserById(ids[i],function(err,result){
            if(err) return callback(err);

            ep.emit('users',result[0]);
        });
    }

    ep.after('users',ids.length,function(users){
        callback(null,users);
    });
}


exports.getAllUsers = function(callback){
    this.getUserById('userId',callback);
}


/**
 * 根据用户ID，修改用户信息
 * callback:
 * - err, 数据库异常
 * - result, 邮箱基本信息
 * @param {int} userid 用户ID
 * @param {Arrays} attrlist 用户属性列表
 * @param {Arrays} vallist  用户属性列表对应的值
 * @param {Function} callback 回调函数
 */
exports.updateUserById = function(userid,attrlist,vallist,callback){
    sql = "update nkuticweb.userinfo SET "
    for(var i = 0;i < attrlist.length;i++){
        var info = "";
        if(i > 0){
            info = ' , '+info;
            console.log("this is info:");
            console.log(info);
        }
        info += attrlist[i] + "=\"" + vallist[i] + "\"";
        sql += info;
    }
    sql += " where userId = "+userid;
    console.log(sql);
    mysql.query(sql,callback);
}

