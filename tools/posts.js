var mysql = require('../modules/db.js');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var cheerio = require('cheerio');
var setting = require('../config/setting');


var hasNum = function(num){
  var self = this;
  if(typeof self == "number"){
    if(num == self)
      return true;
  }
  for(var i = 0;i < this.length; i++){
     if(self[i] == num ){
      return true;
     }
  }
  return false;
}



// 拿到一个用户的账号密码然后对他进行校对
// 校对成功之后将这个用户的昵称和ID返还
exports.checkUser = function(user,callback){
    var username = user.username;
    var password = user.password;

    var sql = 'select * from nkuticweb.userinfo where userName = "'+username+'" and userPassword = "'+password+'"';

    mysql.query(sql,function(err,result){
        //将错误传递
            if(err){
                return callback(err);
            }
            else{
                return callback(null,result[0]);
            }
        });
};

//暂时是为了确认一下session中是否存有user，即user处于登陆状态
exports.getUser = function(req){
    if(req.session.user){
        return true;
    }
    else{
        return false;
    }
}


exports.getDate = function(mydate){

     var date = new Date();
     date.setTime(mydate);
     mydate = date.getFullYear() + "年" + date.getMonth() + "月" + date.getDate() + "日  "+date.getHours()+":"+date.getMinutes();
    return mydate;
}


exports.getArticleBreif = function(article){
    article.publicTime = this.getDate(article.publicTime);
    var $ = cheerio.load(article.articleContent);
    article.articleContent = $('p').text().substr(0,10);
    return article;
}

exports.getArticlesBreif = function(articles){
    console.log(articles);
    for(var i = 0;i < articles.length;i++){
        articles[i] = this.getArticleBreif(articles[i]);
    }
    return articles;
}

exports.getPublicArticles =  function(articles){
  var temp = [];
  for(var i =0;i < articles.length;i++){
    if(articles[i].articleFlag == 1)
      temp.push(articles[i]);
  }
  return temp;
};

exports.isAdmin = function(userid){
  setting.adminId.hasNum = hasNum;
  return setting.adminId.hasNum(userid);
}


exports.getRealArticles = function(articles){
  
  for(var i = 0;i < articles.length;i++){
    console.log(articles[i].publicTime);
    articles[i].publicTime = this.getDate(articles[i].publicTime);
  }
  return articles;
}

exports.userinfo =  function(req,res,next){
      // 用户登录之后就可以查看这些消息了

      ep.all('userinfo',function(userinfo){
            req.userinfo = userinfo;
            next();
      });

      if(req.session.user){
        var userid = req.session.user.userId;
        sql = 'select userImg ,userId,COUNT(*) as unMsgNum from nkuticweb.userinfo,nkuticweb.msginfo where userId = '+ userid +' and msgOwnId = '+userid+' and readFlag = 0';//选出未阅读的消息
        mysql.query(sql,function(err,result){
          if(err){
            console.log(err);
            next(err);
          }
          else{
            ep.emit('userinfo',result);
          }
        })
      }
      else{
          ep.emit('userinfo',null);
      }
}