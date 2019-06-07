var socket = io();

socket.on('connect', () => {
  const nick = $('#nick').val();

  socket.emit('newUser', nick);
});

socket.on('login', (data) => {
  var chat = $('#chat');
  var $msg = $(`<div class='connect'>${data.message}</div>`);
  chat.append($msg);
});

socket.on('logout', (data) => {
  var chat = $('#chat');
  var $msg = $(`<div class='disconnect'>${data.message}</div>`);
  chat.append($msg);
});

socket.on('update', (data) => {
  var lastNode = $('#chat>div:last').text();
  var chat = $('#chat');
  var $msg = $(`<div class='other'>${data.message}</div>`);
  var $nick = $(`<div class='nick'>${data.nick}</div>`);
  
  if (lastNode == data.nick) {
    $msg.insertBefore('.nick');
  } else {
    chat.append($msg);
    chat.append($nick);
  }
  $('#chat').scrollTop($('#chat')[0].scrollHeight)
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
  $('#chat').scrollTop($('#chat')[0].scrollHeight)
};

enter = () => {
  if (window.event.keyCode == 13) {
    submit();
  }
}