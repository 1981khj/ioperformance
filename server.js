var port = process.env.PORT;
var express = require('express');
var app = express.createServer();
var fs = require('fs');
var util = require('util');

app.configure(function() {
  app.set('views', __dirname + '/views');  
  app.set('view engine', 'jade');  
  app.register('.html', require('jade'));
  app.set("view options", {layout: false});
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());  
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/', function(req, res){
    console.log('User-Agent: ' + req.headers['user-agent']);
    var useragent = req.headers['user-agent'];
    res.render('index', {
    title: 'Express',
    useragent: useragent,
    ismobile: checkmobile(useragent)
  });
});

function checkmobile(ua){
    if(ua.match(/mobile/i))
        return true;
    else
        return false;
}

if (!module.parent) {
  app.listen(port);
  console.log('Server is Running! listening on port '+port);
}