const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const { isLoggedIn, isNotLoggedIn } = require('./loginCheck');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const User = require('../schemas/user');

const router = express.Router();

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeChat',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { username, password, nick } = req.body;
  try {
    const exUser = await User.findOne({ username: username});
    console.log(exUser);
    if (exUser) {
      req.flash('joinError', '이미 가입된 유저입니다.');
      return res.redirect('/join');
    }
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        console.error(error);
      } else {
        bcrypt.hash(password, salt, null, async (error, hash) => {
          if (error) {
            console.error(error);
          } else {
            const newUser  = await new User({
              username: username,
              password: hash,
              nick: nick
            });
            newUser.save();
          }
        });
      }
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


router.get('/', (req, res, next) => {
  res.render('index', {
    title: '로그인 페이지 - NodeChat',
  })
});

router.get('/main', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render('main', {
    title: '채팅방 목록 - NodeChat',
  })
});

router.post('/login', isNotLoggedIn, passport.authenticate('local', {
  failureRedirect: '/'
  }), (req, res) => {
    res.redirect('/main');
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/room', async (req, res, next) => {
  res.render('index', { title: req.body.title, nick: req.session.nick });
})

module.exports = router;