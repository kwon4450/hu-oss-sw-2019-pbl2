const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./loginCheck');

const User = require('../schemas/user');

const router = express.Router();

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - OpenChat',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { username, password, password_check, nick } = req.body;
  try {
    const exUser = await User.findOne({ username: username });
    if (exUser) {
      req.flash('joinError', '이미 가입된 유저입니다.');
      return res.redirect('/join');
    }
    if (password != password_check) {
      req.flash('joinError', '비밀번호가 일치하지 않습니다.');
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hash,
      nick: nick
    });
    await newUser.save();
    req.flash('joinSuccess', '회원가입이 완료되었습니다.');
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('index', {
    title: '로그인 페이지 - OpenChat',
    loginError: req.flash('loginError'),
    joinSuccess: req.flash('joinSuccess'),
  });
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/chat');
    });
  })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/chat', isLoggedIn, (req, res) => {
  res.render('chat', {
    title: '채팅방 - OpenChat',
    nick: req.user.nick,
  });
});

module.exports = router;