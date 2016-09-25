/*!
 * nkuticweb-Gorgear
  * Copyright(c) 2016 Gorgear
 */

var express = require('express');
var router = express.Router();

var index = require('./routes/index');
var sign = require('./routes/auth');
var blog = require('./routes/blog');
var activity = require('./routes/activity');
var message = require('./routes/message');
var admin = require('./routes/admin');
var user = require('./routes/user');

var wangeditor = require('./routes/wangeidtor');

//middlewares
var auth =require('./middlewares/auth');

//index
router.get('/',index.index);

//sign
//login
router.get('/login',auth.userDirect,sign.getLogin);
router.post('/login',sign.postLogin);
//register
router.get('/register',auth.userDirect,sign.getRegister);
router.post('/register',sign.postRegister);
//logout
router.get('/logout',sign.getLogout);

//blog
router.post('/wangeditor',wangeditor.postEditor);

router.get('/myblog',auth.userRequired,blog.getMyblog);
router.delete('/myblog',auth.userRequired,blog.deleteMyblog);

router.get('/blog',blog.getBlog);
router.post('/blog',blog.postBlog);

//activity
router.get('/activity',activity.getActivity);

//message
router.get('/message',auth.userRequired,message.getMessage);
router.post('/message/readmsg',auth.userRequired,message.readMsg);
router.post('/message/deletemsg',auth.userRequired,message.deleteMsg);
router.post('/message/sendmsg',auth.userRequired,message.sendMsg);


//admin
router.get('/admin',auth.adminRequired,admin.getAdmin);
router.get('/admin/userlist',auth.adminRequired,admin.userList);
router.get('/admin/userdetail/:userid',auth.adminRequired,admin.userDetail);

//collect
router.get('/collect',user.getCollect);
router.get('/collect/:userid',user.getCollect);
router.post('/user',user.postCollect);

//user
router.get('/user',user.getUser);
router.get('/user/:userid',user.getUser);

//settig
//管理员和本人才可以进入这个界面
router.get('/setting/:userid',auth.userRequired,user.getSetting);
router.post('/setting/:userid',auth.userRequired,user.postSetting);
router.get('/setting/password/:userid',auth.userRequired,user.getPasswordSetting);
router.post('/setting/password/:userid',auth.userRequired,user.postPasswordSetting);

module.exports = router;


