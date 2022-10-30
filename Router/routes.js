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

const session=require("express-session")
const uuid=require("uuid").v4

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
require('./passport-setup');





router.use(express.static(__dirname + "../uploadedphotos/"))
const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }],
  ])
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
  
    const obj = {
        name: req.body.name,
        email: req.body.email,
        // img: {
        //     data: fs.readFileSync("./uploadedphotos/" + req.file.filename),
        //     contentType: "image/png",
        // },


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
router.post('/items', async (req, res) => {
    const { Productname, Price, Category } = req.body
    const Cart = "ADD TO CART"
    // let obj2 = {
    //     Productname: req.body.Productname,
    //     Price: req.body.Price,
    //     Category:req.body.Category,


    // }
    // console.log(req.body)
    // res.json({message:req.body})

    const items = await new ITEMS({ Productname, Price, Category, Cart })
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
    const displayitems = await ITEMS.find()
    return res.json(displayitems)

})
router.post("/deleteitems", async (req, res) => {
    const { Productname } = req.body
    const deleteitems = await ITEMS.deleteOne({ Productname })
    res.json({ message: deleteitems })
    //console.log(displayitems)
})
router.post("/addingtocart", (req, res) => {
    // const {Productname,Price,Category} = req.body

    // console.log(Productname,Price,Category)
    console.log(req.body)

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
    else {
        const data1 = await User.findOne({ email: email })
        if (data1) {
            const token = await data1.generateAuthToken()
            console.log(token)

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            });
            console.log(`${req.cookies.jwt}`)
            res.status(200).send({ message: "the data is correct" })
        }
        else {
            res.status(401).send({ message: "The data isn't found" })
        }
    }
})

router.get("/about", authentication, (req, res) => {
    res.send(req.rootuse)
    console.log(req.rootuse.name)
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
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: item.quantity,
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