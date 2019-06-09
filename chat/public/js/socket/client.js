var socket = io();

var first = true;

socket.on('connect', () => {
  const nick = $('#nick').val();
  
  socket.emit('newUser', nick);
});

socket.on('login', (data) => {
  var chat = $('#chat');
  var $msg = $(`<div class='connect'>${data.nick}${data.message}</div>`);
  chat.append($msg);
  var userlist = data.userlist;
  var userlist_chat = $('#userlist_chat');
  var $user = $(`<div class='user''>${data.nick}</div>`);
  if (!first)userlist_chat.append($user);
  if (first) {
    for (var i = 0; i < userlist.length; i++) {
      $user = $(`<div class='user'>${userlist[i]}</div>`);
      userlist_chat.append($user);
    }
  }
  first = false;
  $('#chat').scrollTop($('#chat').prop('scrollHeight'));
});

socket.on('logout', (data) => {
  var chat = $('#chat');
  var $msg = $(`<div class='disconnect'>${data.nick}${data.message}</div>`);
  chat.append($msg);

  $('.user').remove(`:contains(${data.nick})`);
  $('#chat').scrollTop($('#chat').prop('scrollHeight'));
});

socket.on('update', (data) => {
  var lastNick = $('#chat>.nick:last').text();
  var chat = $('#chat');
  var $msg = $(`<div class='other'>${data.message}</div>`);
  var $nick = $(`<div class='nick'>${data.nick}</div>`);

  if (lastNick != data.nick || $('#chat>div:last').hasClass('mine') || $('#chat>div:last').hasClass('connect') || $('#chat>div:last').hasClass('disconnect') || lastNick == '') {
    chat.append($nick);
  }
  chat.append($msg);
  chat.scrollTop(chat.prop('scrollHeight'));
});

submit = () => {
  var tmp = $('#input').val();
  if (!tmp) return;
  $('#input').val('');

  var chat = $('#chat');
  var $msg = $(`<div class='mine'>${tmp}</div>`);
  chat.append($msg);

  socket.emit('message', {
    type: 'message',
    message: tmp
  });
  $('#chat').scrollTop($('#chat').prop('scrollHeight'));
};

enter = () => {
  if (window.event.keyCode == 13) {
    submit();
  }
}