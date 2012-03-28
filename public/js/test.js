(function($) {    
    //for develop
    var socket = io.connect('http://ioperformance.hjkim.c9.io');
    
    //for deploy
    //var socket = io.connect('http://ioperformance.herokuapp.com/');
    $("#testRun").click(function(){
        var info={};
        info.packet = parseInt($("#packetCnt").val(),10);
        info.repeat = parseInt($("#repeatCnt").val(),10);
        info.duration = parseInt($("#timeDuration").val(),10);
        socket.emit('runPerformance', info);
    });
    
    function setLoadingMsg(msg){
      $('.ui-loader').find('h1').text(msg);
    }
})(jQuery);