const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/usersSchema");
module.exports = (passport) => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, name, password, done) => {
    const user = await User.findOne({
      'name': name
    })
    console.log(user)
    if (user) {
      return done(null, false, req.flash('signupMessage', 'The name is already Taken.'));
    } else {
      const newUser = new User();
      newUser.name = name;
      newUser.password = newUser.encryptPassword(password);
      console.log(newUser)
      await newUser.save();
      done(null, newUser);
    }
  }));

  passport.use('local-signin', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, name, password, done) => {
    const user = await User.findOne({
      name: name
    });
    if (!user) {
      return done(null, false, req.flash('signinMessage', 'No User Found'));
    }
    if (!user.comparePassword(password)) {
      return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }
    return done(null, user);
  }));
};