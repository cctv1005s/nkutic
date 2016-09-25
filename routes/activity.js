var posts = require('../tools/posts');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var cheerio = require('cheerio');
var setting = require('../config/setting');

var models = require('../models');
var activity = models.activity;


exports.getActivity = function(req,res,next){
    ep.all('actinfo',function(actinfo){
        res.render('activity',{user:req.userinfo,actinfo:actinfo});
    })

    activity.getAllActs(function(err,result){
        if(err){console.log(err);next(err)}
        else{
            ep.emit('actinfo',posts.getArticlesBreif(result));
        }
    });
};
