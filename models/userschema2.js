const dotenv=require("dotenv")
dotenv.config({path:"../config/db"})
const mongoose=require("mongoose")
const userSchema2=new mongoose.Schema({
    Productname:{
        type:String,
        required:false,
    },
    Price:{
        type:Number,
        required:false,
    },
    Quantity:{
        type:Number,
        required:false,
    },
    Category:[
        {
        type:String,
        required:false,
        }
    ],
    Cart:{
        type:String,
        required:false,
    },

    
    // tokens:[
    //     {
    //         token:{
    //             type:String,
    //             required:false,  
    //         }
    //     }
    // ]
})
const ITEMS=mongoose.model('ITEMS',userSchema2)
 module.exports=ITEMS