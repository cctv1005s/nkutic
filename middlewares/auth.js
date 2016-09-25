var setting = require('../config/setting')

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

//用户
exports.userRequired = function(req,res,next){
  if (!req.session || !req.session.user) {
      return res.send('<script>window.location.href = "/login"</script>');
    }
    next();
}

exports.userDirect = function(req,res,next){
  if (!req.session.user || !req.session.user.userId) {
  }
  else{
      return res.redirect('/');
  }
    next();
}

//管理员
exports.adminRequired = function(req,res,next){
    if (!req.session || !req.session.user) {
      return res.send('<script>window.location.href = "/login"</script>');
    }
    else{
      setting.adminId.hasNum = hasNum;
      if(!setting.adminId.hasNum(req.session.user.userId)){
        return res.send('login first');
      }
    }
    next();
}