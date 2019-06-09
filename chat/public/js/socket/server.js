const mongoose = require('mongoose');
const SocketIO = require('socket.io');

const User = require('../../../schemas/user');
const Chat = require('../../../schemas/chat');

module.exports = (server) => {
  const io = SocketIO(server);

  var userList = new Array();

  io.on('connection', (socket) => {
    socket.on('rooms', () => {
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    socket.on('newUser', (nick) => {
      socket.nick = nick;
      
      io.sockets.emit('login', {
        type: 'connect',
        name: 'SEVER',
        nick: socket.nick,
        message: '님이 입장하셨습니다.',
        userlist: userList
      });
      userList.push(nick);
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
      socket.broadcast.emit('logout', {
        type: 'disconnect',
        name: 'SERVER',
        nick: socket.nick,
        message: '님이 퇴장하셨습니다.'
      });

      userList.splice(userList.indexOf(socket.nick),1); 
    });

  });
};