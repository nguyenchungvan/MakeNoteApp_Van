const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();
const port = process.env.PORT;
const MongoStore= require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

//
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//Override method
app.use(methodOverride('_method'));

//Session
const session = require('express-session');
app.use(session({
    secret: 'van',
    resave: false,  // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: {maxAge: 86400000}, //1 ngày
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use((req, res, next) => {
    var msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !! msgs.length;
    req.session.messages = [];
    next();
  });

//flash
const flash = require('express-flash')
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//Connect database
const connectDB = require('./config/mongoDB');
connectDB();

//Template engine
app.use(expressLayouts);
app.set('layout','./layouts/mainlayout');
app.set('view engine','ejs');

//Trang chủ

app.get('/',(req,res)=>{
    const locals = {
        title: 'My Notes App',
        description: 'Free Note Nodejs App'
    }
    if (req.user){
        res.redirect('/dashboard/dashboard')
    } else {
        res.render('index',{
            locals,
            layout: './layouts/mainlayout'
        })
    }
});

//Login page
app.get('/login',(req,res)=>{
    const locals = {
        title: 'Login '
    }
    res.render('login',{
        locals,
        layout: './layouts/loginlayout'
    })
})

//about page
app.get('/about',(req,res)=>{
    const locals = {
        title: 'My Notes App',
        description: 'Free Note Nodejs App'
    }
        res.render('about',{
            locals,
            layout: './layouts/mainlayout'
        })
});

//features page
app.get('/features',(req,res)=>{
    const locals = {
        title: 'My Notes App',
        description: 'Free Note Nodejs App'
    }
        res.render('features',{
            locals,
            layout: './layouts/mainlayout'
        })
});

//FAQS page
app.get('/FAQs',(req,res)=>{
    const locals = {
        title: 'My Notes App',
        description: 'Free Note Nodejs App'
    }
        res.render('FAQs',{
            locals,
            layout: './layouts/mainlayout'
        })
});

//Register page
app.get('/register',(req,res)=>{
    const locals = {
        title: 'Register '
    }
    res.render('register',{
        locals,
        layout: './layouts/loginlayout'
    })
})

app.use('/', require('./route/registerRoute'))

//Dashboard page
const dashboardRoute = require('./route/dashboardRoute')
app.use('/dashboard',dashboardRoute)


//Auth login
const googleLoginRouter = require('./route/authGoogle');
app.use('/api/google', googleLoginRouter)

const loginRouter = require('./route/login');
app.use('/api/passport', loginRouter)

const facebookLoginRouter = require('./route/authFacebook');
app.use('/api/facebook', facebookLoginRouter)












app.listen(port, () => console.log(`Example app listening on port ${port}!`))