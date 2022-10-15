const express = require('express')
const router = express.Router()
const passport = require("passport")
const DB = require('../config/db')
const User = require('../models/userschema1')
const ITEMS = require('../models/userschema2')
const jwt = require("jsonwebtoken")
const authentication = require("../middleware/authentication")
const fs = require("fs")
const ejs = require("ejs")
const upload = require("../models/multerr")
const path = require("path")
const server=require("./server.js")
const cookieParser=require("cookie-parser")
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY)
require('./passport-setup');



router.use(cookieParser())

router.use(express.static(__dirname + "./uploadedphotos"))
router.get("/", (req, res) => res.render("demo"))


router.post("/uploads", upload, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(req.file)
            res.send("ok")
        }
    })
})


// router.get('/',(req,res)=>{

//     // res.sendFile(express.static(path.join(__dirname,'/models/index.ejs')))
//     res.render("../models/index")
// }
//)
// router.post('/',(req,res)=>{
//     res.send("i don't know why i am doing this")
// })
router.get('/things', async (req, res) => {
    const datafrommongo = await User.find()

    if (!datafrommongo) {
        console.log('cant find data')
    }
    else {
        return res.json(datafrommongo)
    }
})
router.post('/register', upload, async (req, res) => {
    //    const{name,email}= req.body
    let obj = {
        name: req.body.name,
        email: req.body.email,
        img: {
            data: fs.readFileSync("./uploadedphotos/" + req.file.filename),
            contentType: "image/png",
        },


    }


    //     const user= await  new User({obj})
    //       await user.save()
    //    console.log( res.json(user))


    // })
    User.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});
router.post('/items', async (req, res) => {
    const { Productname, Price, Category } = req.body
    const Cart="ADD TO CART"
    // let obj2 = {
    //     Productname: req.body.Productname,
    //     Price: req.body.Price,
    //     Category:req.body.Category,


    // }
    // console.log(req.body)
    // res.json({message:req.body})

    const items = await new ITEMS({ Productname, Price, Category,Cart })
    await items.save()
    console.log(res.json(items))


    // })
    // ITEMS.create(obj2, (err, item) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         // item.save();
    //         res.redirect('/');
    //     }
    // });
});
router.get("/displayitems", async (req, res) => {
    //const {Category}=req.body
    const displayitems = await ITEMS.find({ Category:"Branded" })
    return res.json(displayitems)
    
})
router.post("/deleteitems", async (req, res) => {
    const {Productname}=req.body
    const deleteitems = await ITEMS.deleteOne({ Productname })
    res.json({ message: deleteitems })
    //console.log(displayitems)
})
router.post("/addingtocart",(req,res)=>{
    const {Productname,Price,Category} = req.body

    console.log(Productname,Price,Category)
    
})
router.post('/logeen', async (req, res) => {

    const { name, email } = req.body
    console.log(name)
    console.log(email)
    if (!name || !email) {
        console.log("sucki")
    //    res.json({message:"fill the form correctly"})
        res.status(400).send({ error: "fill the form correctly" })
        //return a
    }
    else{
    const data1 = await User.findOne({ email: email })
    if (data1) {
        const token = await data1.generateAuthToken()
        console.log(token)
        
         res.cookie("jwt", token,{
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
        });
        console.log(`${req.cookies.jwt}`)
         res.status(200).send({ message: "the data is correct" })
         }
    else{
         res.status(401).send({message:"The data isn't found"})
    }
}
})

router.get("/about", authentication, (req, res) => {
    res.send(req.rootuse)
})
// router.use(passport.initialize())
// router.use(passport.session())
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
//     res.send("Hello how are you!")
// });
// router.get('/success', (req, res) => {
//     res.send("success")
// })

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/success');
//     }
//);
router.get('/stripepath',(req,res)=>{
   res.render("Home",
   {
   key:process.env.STRIPE_PUBLISHABLE_KEY
})
   
})
router.post('/payment', function(req, res){
 
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gautam Sharma',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '110092',
            city: 'New Delhi',
            state: 'Delhi',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: 7000,    // Charing Rs 25
            description: 'Web Development Product',
            currency: 'USD',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("Success") // If no error occurs
    })
    .catch((err) => {
        res.send(err)    // If some error occurs
    });
})
module.exports = router