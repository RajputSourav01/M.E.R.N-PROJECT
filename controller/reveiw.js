// require Listing model and Reveiw model
const Listing = require("../models/listing");
const Review = require("../models/review");



// create new review for any listing
module.exports.createReview = async ( req, res)=>{
    let listing = await Listing.findById(req.params.id);
 //    add review
 console.log(listing);
 let newReview = new Review(req.body.review);
 // put new feild author
 newReview.author = req.user._id;
 // push in schema array
 listing.reviews.push(newReview);
 // saveing
 await newReview.save();
 await listing.save();
 
 console.log("review saved ");
 req.flash("success", "Thank you so much for your kind words! ");
 res.redirect(`/listings/${listing._id}`);
 }

//  delete review by creator
module.exports.deleteReview = async(req, res)=>{
    let { id , reviewId} = req.params;
   await Listing.findByIdAndUpdate( id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted! ");
    res.redirect(`/listings/${id}`);
}