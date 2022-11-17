const dotenv=require("dotenv")
dotenv.config({path:"../config/db"})
const mongoose=require("mongoose")
const userSchema2=new mongoose.Schema({
    id:{
        type:Number,
        required:false,
    },
   
    name:{
        type:String,
        required:false,
    },
   
    price:{
        type:Number,
        required:false,
    },
    stars:{
        type:Number,
        required:false,
    },
    featured:{
        type:Boolean,
        required:false,
    },
    company:{
        type:String,
        required:false,
    },
    stock:{
        type:Number,
        required:false,
    },
    reviews:{
        type:String,
        required:false,
    },
    category:{
        type:String,
        required:false,
    },
    
    colors:[
        {
        type:String,
        required:false,
        }
    ],
    description:{
        type:String,
        required:false,
    },

    image:{
        //data:Buffer,
       type:String,
        // contentType:String,
         required:false,
  
      }
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