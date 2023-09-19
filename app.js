
const express=require("express");
const mongoose=require('mongoose');
const dotenv=require("dotenv");
const bodyParser=require("body-parser");
const connectDB=require("./config/db")
const passport=require("passport");
const session=require("express-session")
const MongoStore=require("connect-mongo")
dotenv.config({path: './config/config.env'});

require('./config/passport')(passport)
connectDB()
const app=express();
app.set("view engine","ejs");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  }))
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`the server is running at ${process.env.NODE_ENV} mode on port ${PORT}`);
})
