const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/User');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const flash = require('express-flash');

//login with username-password
passport.use(new LocalStrategy(
    function verify(username, password, done) {
      User.findOne({ username: username })
        .then( async (user) => { 
        // check username
        if (!user) { 
            return done(null, false, { message: 'Incorrect username or password.'})
        }
        // check password
        const result = await user.isPasswordMatched(password)
        if (!result) { 
            return done(null, false, { message: 'Incorrect username or password.' })
        }
        return done(null, user);
      });
    }
  ));
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  router.post('/login/password', 
  passport.authenticate('local', { 
    failureRedirect: '/login',
    successRedirect: '/dashboard/dashboard',
    failureMessage: true
  }));
 




module.exports = router;