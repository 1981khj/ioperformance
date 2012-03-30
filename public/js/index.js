(function($) {
    //for develop
    var options ={
            //'force new connection':true,
            //'reconnect': false
            //'connect timeout': 1000,
            'reconnection delay': 500,
            'reconnection limit': 32000,
            'max reconnection attempts': 6
        };
    
    //for dev
    var socket = io.connect('http://ioperformance.hjkim.c9.io', options);
    
    //for deploy
    //var socket = io.connect('http://ioperformance.herokuapp.com/', options);    
    
    //console.log(window.location.hostname);
    //for deploy
    //var socket = io.connect('http://ioperformance.herokuapp.com/');

    var conType = null;
    //처음 소켓 접속을 시도 하는 중인 경우
    socket.on('connecting', function(connectionType){        
        status_update("Connecting connectionType: "+connectionType);
        conType = connectionType;
    });
    
    //처음 소켓 접속이 이루어진 경우
    socket.on('connect', function(){
        status_update("Connected");        
        
        $("#info").empty();
        info_update("Socket connected: " + socket.socket.connected);
        info_update("sessionid: "+socket.socket.sessionid);
        info_update("connection Type: "+conType);
        //info_update("connection Type: "+socket.socket.transports[0]);
        info_update("closeTimeout: "+socket.socket.closeTimeout);
        console.log(socket);
    });
    
    socket.on('connect_failed', function(reason){
        status_update("Connect Failed "+reason);
        console.log(reason);
    });

    //소켓 접속을 잃은 경우
    socket.on('disconnect', function(){
        status_update("Disconnected");
    });
    
    socket.on('close', function (){
        status_update("Socket close");
    });

    //소켓 접속을 잃은 후 재 접속 시도
    socket.on('reconnecting', function( reconnetionDelay, reconnectionAttempts ) {
        status_update("Reconnecting in " + reconnetionDelay + " seconds"+" / attempts: "+reconnectionAttempts);
        
        if(options["max reconnection attempts"]==reconnectionAttempts){
            console.log("마지막");
            setTimeout(function(){
                console.log('마지막 연결 체크');
                console.log(socket.socket.connected);
            },reconnetionDelay)
        }
    });

    //소켓 재접속이 성공적으로 이루 어진 경우
    socket.on('reconnect', function(transport_type, reconnectionAttempts){
        status_update("Reconnected"+" transport_type: "+transport_type+" / attempts: "+reconnectionAttempts);
    });

    //소켓 재접속이 실패한 경우
    socket.on('reconnect_failed', function(){
        status_update("Reconnect Failed");
    });


    

    
    /*socket.on('error', function (reason){
        console.log('socket error');
        console.error('Unable to connect Socket.IO', reason);
        console.log(reason);
    });
    
    socket.socket.on('error', function (reason){
        console.log('socket.socket error');
        console.log('Unable to connect Socket.IO', reason);
        console.log(reason);
    });*/
    
    

    $("#connect").bind("click",function(){
        connect();
    });

    $("#disconnect").bind("click",function(){
        disconnect();
    });

    function connect() {
        //재 접속을 원하는 경우 
        socket = io.connect('http://ioperformance.hjkim.c9.io',{'force new connection':true});
        
        //재 접속을 하는 경우 기존의 소켓 아이디가 살아 있어 해당 아이디를 강제적으로 커넥션을 끊은 다음
        //재 접속하여 아이디를 받거나 
        socket.on('connecting', function(){
            status_update("new Connecting");
            console.log("new Socket connecting");
        });
        //새로운 커네션을 설정하고 이벤트를 재 할당 해야 한다.
        socket.on('connect', function(){
            status_update("new Connected");
            console.log("Socket connected: " + socket.socket.connected);
        });        
    }

    function disconnect() {
        socket.disconnect();
    }

    function message(data) {
        console.log("message: "+data);
    }

    function status_update(txt){
        console.log("status_update: "+txt);
        $("#status").text(txt);
    }
    
    function info_update(txt){
        console.log("info_update: "+txt)
        $("#info").append(txt+"<br/>");
    }
    
    

    function esc(msg){
        return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function send() {
        socket.send("Hello Server!");
    };

})(jQuery);