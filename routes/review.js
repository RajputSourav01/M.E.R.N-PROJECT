const express = require ("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require ("../utils/wrapAsync.js");
const ExpressError = require ("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require ("../models/review.js");
const Listing = require ("../models/listing.js");
const { loggedinAuthentication, isReveiwAuthor } = require("../midlwerAuthenti.js");

// constroller require
const reviewController = require("../controller/reveiw.js");

// validate server side for review require with listinschema on top.
const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// review post form rout on restful /listings/:id/reviews

router.post("/", loggedinAuthentication ,validateReview,wrapAsync(reviewController.createReview ));

// review dlete rout
router.delete("/:reviewId",loggedinAuthentication, isReveiwAuthor , wrapAsync(reviewController.deleteReview));

module.exports = router;