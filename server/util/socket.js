let socket;
let ioObj;
let socketModule = {
  setSocket: (io) => {
    ioObj = io;
    io.on('connection', function (sock) {
      socket = sock;
      socket.on('new_con', function (data) {
        //socket.emit('new_con', socket.id )
        console.trace(data)
        socket.join(data.userId, () => {
          let rooms = Object.keys(socket.rooms);
          console.log(rooms); // [ <socket.id>, 'room 237' ]
          io.to(data.userId).emit('new_con','a new user has joined the room'); // broadcast to everyone in the room
        });
      });
    });
  },
  init: (io) => {
/*    io.on('connection', function (socket) {
      socket.on('testConnection', function (data) {
        socket.broadcast.emit('testConnectionServer', data);
      })
    });*/
  },
  send: function (instance, data, userId) {
    ioObj.to(userId).emit(instance, data);
  }
};

module.exports = socketModule;
