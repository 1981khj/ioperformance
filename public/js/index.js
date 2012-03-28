(function($) {
    //for develop
    var socket = io.connect('http://ioperformance.hjkim.c9.io');
    
    //for deploy
    //var socket = io.connect('http://ioperformance.herokuapp.com/');
    console.log(socket);
    console.log(socket.socket.transport);
    console.log(socket.socket.transport.sessid);
    console.log(socket.socket.transport.name);
})(jQuery);