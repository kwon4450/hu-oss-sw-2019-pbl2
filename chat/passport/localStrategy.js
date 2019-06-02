const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

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
              done(null, false, { message: '비번 틀림' });
            }
          }
        });
      } else {
        done(null, false, { message: 'id 틀림' });
      }

    } catch (err) {
      console.error(err);
      done(err);
    }
  }));
};