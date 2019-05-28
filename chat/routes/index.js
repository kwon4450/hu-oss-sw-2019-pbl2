const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const User = require('../schemas/user');

const router = express.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: '채팅방 닉네임 정하는 페이지' });
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  res.render('room', { title: '채팅방 생성 페이지' });
})

// router.post('/', (req, res, nest) => {
//   const selected = User.find({ nick: req.body.nick });
//   if (selected) {

//     res.render('index', { title: '채팅방 닉네임 정하는 페이지' });
//   } else {
    
//     res.render('room', { title: '채팅방 생성 페이지' });
//   }
// })

router.post('/room', (req, res, next) => {
  console.log(req.body);
})

// router.post('/room', async (req, res, next) => {
//   try {
//     const room = new Room({
//       title: req.body.title,
//       max: req.body.max,
//       master: req.body.master,
//       password: req.body.password,
//     });
//     const newRoom = await room.save();
//     const io = req.app('io');
//     io.of('/room').emit('newRoom', newRoom);
//     res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

module.exports = router;
