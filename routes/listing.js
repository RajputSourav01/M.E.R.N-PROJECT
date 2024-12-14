const express = require ("express");
const router = express.Router();
const wrapAsync = require ("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require ("../utils/ExpressError.js");
const Listing = require ("../models/listing.js");
const { loggedinAuthentication , isOwner } = require("../midlwerAuthenti.js");

// controller require
const listingController = require("../controller/listings.js");
// npm i multer for image uploading enctype="multipart"
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });

// validate schema before saving listing throw error with joi
const validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

///// implementing operation 
// index rout /listing for all list.listingController= controller>listing.js


//* router.get("/",wrapAsync(listingController.index));

///// create new data or listing 
//* router.get("/new",loggedinAuthentication, listingController.renderNewForm);
//* router.post("/", loggedinAuthentication ,validateListing, wrapAsync(listingController.saveNewForm));


//// show rout ,read operation for all listings
//* router.get("/:id",wrapAsync(listingController.showListing));


//// edit form routs and edit submission
//* router.get("/:id/edit", loggedinAuthentication,isOwner ,wrapAsync(listingController.editListing ));

//// submission or update rout

//* router.put("/:id", loggedinAuthentication, isOwner ,validateListing, wrapAsync(listingController.editFormSubmission ));

//// delete rout
//* router.delete("/:id", loggedinAuthentication , isOwner ,wrapAsync( listingController.deleteListing));
//// "/listings" remove from all routes becouse app.use are using "/listings", listings. 

// ------------------------------------------------------------------------------------------------------------------------------------------------
// new way to compact the code using Router.route() = its use for same path having diffrent diffrent request.

// for "/" path having 2 req : get and post
router
.route("/")
.get(wrapAsync(listingController.index))
.post(loggedinAuthentication ,upload.single('listing[image]'),validateListing, wrapAsync(listingController.saveNewForm));

// .post(upload.single('listing[image]') ,(req,res)=>{
//     // res.send(req.body);
//     res.send(req.file);
// });

// for new post form rout
router.route("/new")
.get(loggedinAuthentication, listingController.renderNewForm);
// for "/:id"path
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(loggedinAuthentication, isOwner ,upload.single('listing[image]') ,validateListing, wrapAsync(listingController.editFormSubmission ))
.delete( loggedinAuthentication , isOwner ,wrapAsync( listingController.deleteListing));
// for "/:id/edit"
router.route("/:id/edit")
.get( loggedinAuthentication,isOwner ,wrapAsync(listingController.editListing ));





module.exports = router ;
