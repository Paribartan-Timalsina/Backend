const jwt=require("jsonwebtoken")
const User=require("../models/userschema1")
const path= require('path')
const dotenv= require('dotenv')
dotenv.config({path:'./config/config.env'})
const authentication= async (req,res,next)=>{
try{
const token= req.cookies.jwt
if(!token){throw new Error("User isn't logged in") }
const verifytoken=jwt.verify(token,process.env.SECRET_KEY)
const rootuse=await User.findOne({_id:verifytoken._id,"tokens.token":token})
if(!rootuse){throw  new Error("User isn't found")}
req.token=token
req.rootuse=rootuse
req.userID=rootuse._id
next()
}catch(err){
    res.status(404).send("unauthorized")
    console.log(err)
}
}
module.exports=authentication