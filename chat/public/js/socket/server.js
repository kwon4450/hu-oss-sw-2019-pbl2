const mongoose = require('mongoose');
const SocketIO = require('socket.io');

const User = require('../../../schemas/user');
const Chat = require('../../../schemas/chat');

module.exports = (server) => {
  const io = SocketIO(server);
  
  io.on('connection', (socket) => {
    socket.on('rooms', () => {
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    socket.on('newUser', (nick) => {
      socket.nick = nick;

      io.sockets.emit('login', {
        type: 'connect',
        name: 'SEVER',
        message: socket.nick + '님이 접속하였습니다.'
      });
    });

    socket.on('message', (data) => {
      data.nick = socket.nick;
      
      const chat = new Chat({
        user: mongoose.Types.ObjectId(User.findOne({nick: data.nick})._id),
        chat: data.message,
      });
      chat.save();
      
      socket.broadcast.emit('update', data);
    });

    socket.on('disconnect', () => {
      console.log(socket.nick + '님이 나가셨습니다.');

      socket.broadcast.emit('logout', {
        type: 'disconnect',
        name: 'SERVER',
        message: socket.nick + '님이 나가셨습니다.'
      });
    });

  });
};