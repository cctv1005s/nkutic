var request = require('request');

request('http://222.30.60.9/meol/homepage/common/',function(err,req,body){
    console.log(body);
});