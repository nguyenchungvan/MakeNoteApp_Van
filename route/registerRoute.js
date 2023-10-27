const express = require('express');
const router = express.Router();
const User = require('../model/User');
const flash = require('express-flash');

//Create username-password
router.post('/register', async (req,res) =>{
    if(req.body.password !== req.body.passwordRP) {
        req.flash('fail','Password and Password Repeat need equal')
        res.redirect('/register')
    }
    else {
    const username = req.body.username;
    const findUser =  await User.findOne({username:username});    
    if(!findUser){
        //tạo user
        const newUser = await User.create(req.body);
        req.flash('login','Welcome');
        res.render('login',{
            layout: './layouts/loginlayout',
        })
    }
    else {
        req.flash('infor','Username already existed');
        res.render('register',{
            layout: './layouts/loginlayout',
        })
    }
  }
})

module.exports = router;