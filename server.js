var port = process.env.PORT;
var express = require('express');
var app = express.createServer();
var fs = require('fs');
var util = require('util');
var mongo = require("mongoskin");
var mongoUrl = "mongodb://admin:admin@ds031637.mongolab.com:31637/servicelog?auto_reconnect";
var db = mongo.db(mongoUrl);
var logCollection = db.collection("log");
var io = require('socket.io').listen(app);

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

app.get('/test', function(req, res){
    res.render('test');
});

app.get('/client', function(req, res){
    res.render('client');
});

var sendPacketTimer = null;

io.sockets.on('connection', function(socket) {
    socket.on('runPerformance', function(data){
        console.log("runPerformance");
        console.log(data);
        //{ packet: 5, repeat: 5, duration: 5 }
        //setTime
        var repeat = 1;
        var totalPacket = data.packet * data.repeat;

        io.sockets.emit('sendStart',totalPacket);
        sendPacketTimer = setInterval(function(){
            io.sockets.emit('currentRepeat', repeat);
            for(var i=0; i<data.packet; i++){
                io.sockets.emit('sendPacket', 'echo');
            }
            repeat++;
            if(repeat>data.repeat){
                console.log("clearrepeat");
                clearInterval(sendPacketTimer);
                io.sockets.emit('sendFinish');
            }

        }, 1000*data.duration);

    });

    socket.on('sendLogData', function(data){
        logCollection.insert({content:data});
        console.log("saveData");
	});

	socket.on('disconnect', function(){

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