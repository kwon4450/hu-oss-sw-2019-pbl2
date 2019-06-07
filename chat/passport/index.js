const local = require('./localStrategy');
const User = require('../schemas/user');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) =>{
      done(err, user);
    });
  });

  local(passport);
}