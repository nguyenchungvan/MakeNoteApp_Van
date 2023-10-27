const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const flash = require('express-flash');

//login with google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    const newUser = {
        googleId: profile.id,
        username: profile.id,
        password: profile.id,
        name: profile.name.givenName,
        profileImage: profile.photos[0].value,
    }
    try {
        let user = await User.findOne({googleId: profile.id});
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

router.use('/auth/google', passport.authenticate('google', { scope: ['profile'] }));


router.get('/google/callback', passport.authenticate('google', 
{ 
    failureRedirect: '/login',
    successRedirect: '/dashboard/dashboard'
}))

//User data after succeed
passport.serializeUser((user,done)=>{
    done(null,user.id)
})

//Retrive user data from session
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  //logout
  //Destroy user
router.get('/logout', (req,res)=>{
    req.session.destroy(error =>{
        if(error){
            console.log(error);
            res.send('Logout error')
        }
        else {
            res.redirect('/')
        }
    })
})






module.exports = router;