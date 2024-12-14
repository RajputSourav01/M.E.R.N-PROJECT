if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate =require("ejs-mate");
app.engine("ejs" , ejsMate);
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
const methodOverride= require("method-override")
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
// for passport user authentication------------------------------------------------------------------ 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// -------------------------------------------------------------------------------------------------------
const ExpressError = require ("./utils/ExpressError.js");
const session = require("express-session");
// ----------for online session store
const MongoStore = require('connect-mongo');
// --------------------------------------------
const flash =  require("connect-flash");
// online session store mdlwre


// connection to db
app.listen(5050,()=>{
    console.log("server listining on 5050");
});


// db connection "wanderlust"
let dbUrl = process.env.ATLASDB_URL;

async function main() {
    
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

// --------------------------------
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter: 24 * 3600  , // time period in seconds
});
store.on("error" , () =>{
    console.log("error in mongodb session store" , err);
});
// session midleware
const sessionOption = {
    store, // online session store var
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
         expires: Date.now()+7*24*60*60*1000,
         maxAge: 7*24*60*60*1000,
         httpOnly: true,
    },
};


// root rout
// app.get("/",(req,res)=>{
//     res.send("web root load");
// });
// ------------------------------------------

app.use(session(sessionOption));
app.use(flash());
// USE passport after session----------------------------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// authentication within the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  passport ends middleware-------------------------------------------------------------------------------------------------

// flash handler middleware for index

app.use((req, res ,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});
// --------------------------------------------------------------------------------------
// demo user for login credential chek
// app.get("/demouser", async(req,res)=>{
//            let fakeUser= new User({
//               email: "student@gamil.com",
//                username: "sourav",
//                     });
//  let registeredUser = await User.register(fakeUser , "hello");
//  res.send(registeredUser);
// });
// ----------------------------------------------------------------------------------------------------------
// requiring  routes by reconstructing
const listingRouter = require ("./routes/listing.js");
const reviewRouter = require ("./routes/review.js");
const userRouter = require ("./routes/user.js");
const { error } = require("console");
// -------------------------------------------------------------







// -------------------------------------------------------------------------------------------------------
// create a document n the basis of collection schema "listing.js"
// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beech",
//         price: 1500,
//         location: "calangute , goa",
//         country: "India"
//     });
//   await sampleListing.save();
//   console.log ("sample data saved");
//   res.send("succesful saved");
// });
// -------------------------------------------------------------------------------------------------


// use common routes listing.js,review.js
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/" , userRouter);
// -------------------------------------------


// error handling middleware for wrapasync

// for all type of api request which are not existing
app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "page not found !"));
});

app.use((err,req,res,next)=>{
    let { statusCode=500, message= "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err});
   // res.status(statusCode).send(message)  ;
});




