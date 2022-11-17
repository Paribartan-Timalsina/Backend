
const mongoose=require('mongoose')
const Db=require('../config/db')
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:false,
    },
    password:{
        type:String,
        required:false,
    },
    phone:{
        type:String,
        required:false,
    },
    profession:{
        type:String,
        required:false,
    },
    img:{
      data:Buffer,
      //type:String,
       contentType:String,
       required:false,

    },
    tokens:[
        {
            token:{
                type:String,
                required:false,  
            }
        }
    ]
})
userSchema.methods.generateAuthToken=async function(){
    try{
        let token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
         await this.save()
         
         return token;
         
    }catch(err){
      console.log(err)  
    }
}
 const User=mongoose.model('USERS',userSchema)
 module.exports=User