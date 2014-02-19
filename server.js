var socket = require('socket.io');
var connect = require('connect');

var server = connect().
  use(connect.static(__dirname+'/public')).
  listen(8080);
console.log("Server started on port 8080");

var io = socket.listen(server);
io.sockets.on('connection', function(socket) {

  socket.on('send', function(msg) {
    socket.broadcast.emit('receive', msg);
  });

});
