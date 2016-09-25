var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();

var message = {};
var messageSchema =[
    'sendUser',
    'msgId',
    'msgContent',
    'sendTime',
    'readFlag',
    'msgType',
    'msgOwnId',
    'msgOnId'
];
/**
 * 根据用户ID，查找用户邮箱
 * callback:
 * - err, 数据库异常
 * - result, 邮箱基本信息
 * @param {int} id 用户ID
 * @param {Function} callback 回调函数
 */
message.getMailboxByUserId = function(id,callback){
    sql = "select userNick,userImg,msgOwnId,msgOnId,(SELECT msgContent FROM nkuticweb.msginfo where msgOnId = m1.msgOnId ORDER BY sendTime DESC LIMIT 1) AS msgContent,msgType,MAX(sendTime) as lastSendTime ,(SELECT COUNT(*) FROM nkuticweb.msginfo where readFlag = 0 and msgOnId = m1.msgOnId and msgOwnId = m1.msgOwnId) as unMsgNum from nkuticweb.userinfo , nkuticweb.msginfo m1 where  userId = m1.msgOnId  and m1.msgOwnId = "+id+"  GROUP BY m1.msgOnId ;";
    mysql.query(sql,callback);
};

/**
 * 根据用户ID列表，查找用户们的邮箱
 * callback:
 * - err, 数据库异常
 * - result,邮箱基本信息
 * @param {Arrays} ids 用户ID
 * @param {Function} callback 回调函数
 */

message.getMailboxesByUserId = function(ids,callback){
    for(var i = 0;i < ids.length;i++){
        this.getMailboxByUserId(ids[i].userId,function(err,result){
            if(err)return callback(err);    
            ep.emit('mailbox',result[0]);
        });
    }
    
    ep.after('mailbox',ids.length,function(mailbox){
          return callback(null,mailbox);
    });
};

/**
 * 根据用户ID，查找用户邮箱内容
 * callback:
 * - err, 数据库异常
 * - result, 邮箱信息
 * @param {int} ownid 邮箱拥有者ID
 * @param {int} onid 邮箱关联者ID
 * @param {Function} callback 回调函数
 */
message.getMailByUserId = function(ownid,onid,callback){
     sql = "select sendUser,msgId,msgContent,sendTime,readFlag,msgType,msgOwnId,msgOnId,userImg,userNick from nkuticweb.msginfo,nkuticweb.userinfo where msgOwnId = "+ownid+" and userId= sendUser  and msgOnId = "+onid + " order by sendTime";
     mysql.query(sql,callback);
}



message.saveMailByuserId = function(ownid,onid,attr,callback){
    var messageinfo =[];
    for(var i in messageSchema){
        if( typeof attr[messageSchema[i]] == 'undefined'){
            messageinfo.push(messageSchema[i]);
        }
        else{
            messageinfo.push(attr[messageSchema[i]]);
        }
    }

    for(var i =0;i<messageinfo.length;i++){
        console.log(messageinfo[i]);
    }
    sql = "update nkuticweb.msginfo set sendUser = ?,msgId = ?,msgContent=?,sendTime=?,readFlag=?,msgType=?, msgOwnId=?,msgOnId=? where msgownid = "+ownid+" and msgonid = "+onid;
    mysql.query(sql,messageinfo,callback);
};


module.exports = message; 