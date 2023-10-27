const express = require('express');
const router = express.Router();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const User = require('../model/User');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    state: true,
  },
  async function(accessToken, refreshToken, profile, done) {
    const newUser = {
        facebookId: profile.id,
        username: profile.id,
        password: profile.id,
        name: profile.displayName,
    }
    try {
        let user = await User.findOne({facebookId: profile.id});
        if (user){
            done(null,user)
        }
        else {
            user = await User.create(newUser);
            done(null,user)
        }

    } catch (error) {
        console.log(error)
    }
})
  );

  passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      done(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });

  router.get('/login/federated/facebook', passport.authenticate('facebook'));

  router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
    successReturnToOrRedirect: '/dashboard/dashboard',
    failureRedirect: '/login'
  }));


module.exports = router;