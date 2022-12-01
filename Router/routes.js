const express = require('express')
const router = express.Router()
const passport = require("passport")
const DB = require('../config/db')
const User = require('../models/userschema1')
const ITEMS = require('../models/userschema2')
const CARTITEMS = require('../models/userschema3')
const jwt = require("jsonwebtoken")
const authentication = require("../middleware/authentication")
const fs = require("fs")
const ejs = require("ejs")
const upload = require("../models/multerr")
const productsupload = require("../models/productsmulter")
const path = require("path")

const session=require("express-session")
const uuid=require("uuid").v4

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
require('./passport-setup');





router.use(express.static(__dirname + "/uploads/"))

router.get("/", (req, res) => res.render("demo"))


// router.post("/uploads", upload, (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(req.file)
//             res.send("ok")
//         }
//     })
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
router.post('/register', upload,  (req, res) => {
  
    var obj =new User( {
        name: req.body.name,
        email: req.body.email,
        password:req.body.password,
        img: req.file.path
       })
    if(!req.body.name||!req.body.email||!req.body.password){
        res.status(400).send({ error: "fill the form correctly" })
        return
    }
    User.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("success")
            // item.save();
            res.redirect('/itemlist');
        }
    });
});
router.post('/items',productsupload, async (req, res) => {
   // const { name, price,company,id,description,colors,stars,featured,stock,reviews,category,img } = req.body
    var list =new ITEMS( {
        name: req.body.name,
        id:req.body.id,
        price: req.body.price,
        company:req.body.company,
        stock:req.body.stock,
        stars:req.body.stars,
        reviews:req.body.reviews,
        description:req.body.description,
        featured:req.body.featured,
        colors:req.body.colors,
        category:req.body.category,
       image: req.file.path,
        //  image: {
        //      data: fs.readFileSync('./products/' + req.file.filename),
      
        //  contentType: "image/png",
        //    },
       //img:fs.readFileSync('./uploads/' + req.file.filename)

    //img:req.file.filename,
 

    })
       

   
    ITEMS.create(list, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("success")
            // item.save();
            res.redirect('/itemlist');
        }
    });
    // const items = await new ITEMS({ name, price,company,id,description,colors,stars,featured,stock,reviews,category,img })
    // await items.save()
    // console.log(res.json(items))


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
router.post('/updatedata', async (req, res) => {
    //console.log(req.body)
   // const { Productname, Price, Quantity,Category } = req.body
   const deletedata=await ITEMS.deleteMany()
   const a=req.body
    Array.from(a).forEach( async (item)=>{
        console.log(item)
        const { name, price,company,id,description,colors,stars,featured,stock,reviews,category,image} = item
        const items = await  new ITEMS({name, price,company,id,description,colors,stars,featured,stock,reviews,category,image })
      await items.save()
    })
    // const deleteddata=await ITEMS.deleteMany()
    
    // let obj2 = {
    //     Productname: req.body.Productname,
    //     Price: req.body.Price,
    //     Category:req.body.Category,


    // }
    // console.log(req.body)
    // res.json({message:req.body})

    // const items = await new ITEMS({ Productname, Price, Quantity,Category, Cart })
    // await items.save()
    // console.log(res.json(items))


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
    const displayitems = await ITEMS.find()
    
//     let x=[];
//    displayitems.map(d=>{d.image=d.image.blob(); x.push(d)})
//   console.log(x)

    return res.json(displayitems)

})
router.get("/displaycartitems", async (req, res) => {
    //const {Category}=req.body
    const displayitems = await CARTITEMS.find()
    
//     let x=[];
//    displayitems.map(d=>{d.image=d.image.blob(); x.push(d)})
//   console.log(x)
console.log(displayitems)
    return res.json(displayitems)

})
router.post("/deleteitems", async (req, res) => {
    let { name} = req.body
    
    const deleteitems = await ITEMS.deleteOne({name})
   if(!deleteitems){
    res.status(400).send({message:"Deleted successfully"})
   }
    
    //console.log(displayitems)
})
router.post("/deleteuser", async (req, res) => {
    let { name} = req.body
    console.log(name);
    const deleteitems = await User.deleteOne({name})
    console.log(deleteitems)
    
    //console.log(displayitems)
})
router.post("/singleproduct/:id", async (req, res) => {
     let { id } = req.params
   
     const product = await ITEMS.findOne({ id} )
     console.log(product)
    return res.json(product)
    //console.log(displayitems)
   // res.send(req.params)
})
router.post("/addingtocart", (req, res) => {
    // const {Productname,Price,Category} = req.body

    // console.log(Productname,Price,Category)
    console.log(req.body)

})
router.post('/logeen', async (req, res) => {

    const {  email,password } = req.body
    console.log(password)
    console.log(email)
    if (!password || !email) {
        console.log("sucki")
        //    res.json({message:"fill the form correctly"})
        res.status(400).send({ error: "fill the form correctly" })
        //return a
    }
    else {
        const data1 = await User.findOne({ email: email })
        if (data1) {
            if(data1.password===password){
           
            const token = await data1.generateAuthToken()
            console.log(token)

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            });
            console.log(`${req.cookies.jwt}`)
            res.status(200).send({ message: "the data is correct" })
        }
        else{
            res.status(401).send({ message: "The data isn't found" })
        }
        }
        else {
            res.status(401).send({ message: "The data isn't found" })
        }
    }
})

router.get("/about", authentication,  async (req, res) => {
    if(!req.rootuse){
        console.log("xya xya namileko")
        res.status(404).send({message:"User isn't  Logged in seccessfully"})
    }
    else{
    return  res.json(req.rootuse)
    }
    
})
router.post("/logoutt", (req, res) => {
    console.log("logging out the user")
   res.clearCookie("jwt",{path:"/"})
    res.status(200).send({message:"User Logged out seccessfully"})
})

// router.use(passport.initialize())
// router.use(passport.session())

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
    res.send("Hello how are you!")
});
router.get('/success', (req, res) => {
    res.send("success")
})
router.get('/failed', (req, res) => {
    res.send("success")
})

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/success');
    }
);


  
  router.post("/create-checkout-session", async (req, res) => {
    try {
        const a=req.body
        console.log(a)
    // a.items.map( async (item)=>{
    //     console.log(item)
    //     const { name, price,company,category,image,stock} = item
    //     const items = await  new CARTITEMS({name, price,company,category,image ,stock})
    //   await items.save()
    // })
    const items=await new CARTITEMS({a})
    await items.save()
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
         
          return {
            price_data: {
              currency: "npr",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price,
            },
            quantity: item.stock,
          }
        }),
        success_url: `${process.env.CLIENT_URL}/itemlist`,
        cancel_url: `${process.env.CLIENT_URL}/signin`,
      })
       return res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
module.exports = router