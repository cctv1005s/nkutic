var request = require('request');
var cheerio = require('cheerio');


exports.getCourse = function(webname,page,callback){
    //慕课网
    if(page <= 0){
        page = 1;
    }

    if(webname == 'imooc'){
        request('http://www.imooc.com/course/list?page='+page,function(err,resp,body){
            var $ = cheerio.load(body);
            var course = $('.course-one');
            var courselist = [];
            var sitename = 'http://www.imooc.com';

            course.each(function(index, el) {
                var courseitem = {};
                var item = $(el);
                
                courseitem.href = sitename + $(item.find('a')).attr('href');
                courseitem.img = $(item.find('.course-list-img img')).attr('src');
                courseitem.title = $(item.find('h5')).text();
                courseitem.breif = $(item.find('.text-ellipsis')).text();
                courseitem.type = webname;

                courselist.push(courseitem);
            });
            if(err){
                return callback(err);
            }
            else{
                return callback(null,courselist);
            }
        });        
    }

    if(webname == 'shiyan'){
         //实验楼
        request('https://www.shiyanlou.com/courses/?course_type=all&tag=all&page='+page,function(err,resp,body){
            var $ = cheerio.load(body);
            var course = $('.course');
            var courselist = [];
            var sitename = 'http://www.shiyanlou.com';

            course.each(function(index, el) {
                var courseitem = {};
                var item = $(el);

                courseitem.href =sitename + $(item.find('.course-box')).attr('href');
                courseitem.img = $(item.find('img')).attr('src');
                courseitem.title = $(item.find('.course-title')).text();
                courseitem.breif = $(item.find('.course-title')).text();
                courseitem.type = webname;
                
                courselist.push(courseitem);               
            });

            if(err){
                return callback(err);
            }
            else{
                return callback(null,courselist);
            }             
        });
    }
}
