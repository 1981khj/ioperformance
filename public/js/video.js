(function($) {
    //for develop
    var options ={            
        'reconnection delay': 500,
        'reconnection limit': 32000,
        'max reconnection attempts': 6
    };
    
    //for dev
    //var video = io.connect('http://ioperformance.hjkim.c9.io/video', options);
    
    //for deploy
    var video = io.connect('http://ioperformance.herokuapp.com/video', options);    
    
    var conType = null;
    //처음 소켓 접속을 시도 하는 중인 경우
    video.on('connecting', function(connectionType){        
        status_update("Connecting connectionType: "+connectionType);
        conType = connectionType;
    });
    
    //처음 소켓 접속이 이루어진 경우
    video.on('connect', function(){
        status_update("Connected");
        $("#info").empty();
        info_update("Socket connected: " + video.socket.connected);
        info_update("sessionid: "+video.socket.sessionid);
        info_update("connection Type: "+conType);        
    });
    
    video.on('connect_failed', function(){
        status_update("Connect Failed");        
    });

    //소켓 접속을 잃은 경우
    video.on('disconnect', function(){
        status_update("Disconnected");
    });
    
    video.on('close', function (){
        status_update("Socket close");
    });

    //소켓 접속을 잃은 후 재 접속 시도
    video.on('reconnecting', function( reconnetionDelay, reconnectionAttempts ) {
        status_update("Reconnecting in " + reconnetionDelay + " seconds"+" / attempts: "+reconnectionAttempts);        
    });

    //소켓 재접속이 성공적으로 이루 어진 경우
    video.on('reconnect', function(transport_type, reconnectionAttempts){
        status_update("Reconnected"+" transport_type: "+transport_type+" / attempts: "+reconnectionAttempts);
    });

    //소켓 재접속이 실패한 경우
    video.on('reconnect_failed', function(){
        status_update("Reconnect Failed");
    });


    video.on('drawImg', function(data) {
        console.log("drawImg");
        //console.log(data);
        $("#outPutImg").attr("src",data);
    });


    function status_update(txt){
        console.log("status_update: "+txt);
        $("#status").text(txt);
    }
    
    function info_update(txt){
        console.log("info_update: "+txt)
        $("#info").append(txt+"<br/>");
    }
})(jQuery);