const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../schemas/user');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true,
  }, async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (user) {
        bcrypt.compare(password, user.password, (error, result) => {
          if (error) {
            console.error(error);
          } else {
            if (result) {
              done(null, user);
            } else {
              done(null, false, { message: '등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.' });
            }
          }
        });
      } else {
        done(null, false, { message: '등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.' });
      }

    } catch (err) {
      console.error(err);
      done(err);
    }
  }));
};