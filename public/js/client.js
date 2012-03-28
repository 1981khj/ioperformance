(function($) {
    //for develop
    var socket = io.connect('http://ioperformance.hjkim.c9.io');
    
    //for deploy
    //var socket = io.connect('http://ioperformance.herokuapp.com/');
    
    var aPacket = [];
    var nTotalPacket = null;
    
    socket.on('sendStart', function(data) {
        console.log("sendStart");
        aPacket = [];
        nTotalPacket = data;
        $.mobile.showPageLoadingMsg();        
    });
    
    socket.on('sendPacket', function(data) {        
        aPacket.push(data);
        //console.log(data);
	});
        
    
    socket.on('sendFinish', function() {
        console.log("sendFinish");
        console.log(aPacket.length);
        $.mobile.hidePageLoadingMsg();
        console.log(aPacket.length+" / "+nTotalPacket);
        console.log(getPercentRate(aPacket.length, nTotalPacket));
        var sLogData = aPacket.length+" / "+nTotalPacket+"=>"+getPercentRate(aPacket.length, nTotalPacket)+"%";        
        socket.emit('sendLogData', sLogData);
        
    });
    
    socket.on('currentRepeat', function(data) {
        console.log("currentRepeat");
        console.log(data);
        setLoadingMsg(data);
    });
    
    
    function setLoadingMsg(msg){
      $('.ui-loader').find('h1').text(msg);
    }
    
    function getPercentRate(val, total){
        return Math.floor((val / total) * 100);
    }
    
})(jQuery);