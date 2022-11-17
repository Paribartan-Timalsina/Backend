const express= require('express')
const path= require('path')
const session = require("express-session")
const dotenv= require('dotenv')
const body_parser =require('body-parser')
const connectDB= require('./config/db')
const passport=require("passport")
const cors=require('cors')
const ejs=require('ejs')
const cookieParser=require("cookie-parser")
//const client = require('./config/db')
//Load config
const multer=require("multer")
dotenv.config({path:'./config/config.env'})

connectDB()


const User=require('./models/userschema1')
const ITEMS=require('./models/userschema2')

const app=express() 
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
 }
  
));
app.use(body_parser.urlencoded({ extended: true,parameterLimit:100000,limit:"500mb" }));
app.use(cookieParser())
app.use(express.json())
app.use(session({
    secret: 'mercuia',
    resave: true,
    saveUninitialized: false,
    
  }));

app.use(passport.initialize())
app.use(passport.session())
app.set("view engine", "ejs");


app.use( '/',require('./Router/routes'))
app.use('/products', express.static('./products'));
const PORT=process.env.PORT
const http=require("http")
const server = http.createServer(app);
app.listen(PORT,()=>console.log(`server is running in ${PORT} MODE `))
