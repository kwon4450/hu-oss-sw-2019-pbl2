const local = require('./localStrategy');
const User = require('../schemas/user');

module.exports = (passport) => {
  console.log("before passport");
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) =>{
      done(err, user);
    });
  });
  console.log("after passport");
  local(passport);
  console.log("end passport");
}