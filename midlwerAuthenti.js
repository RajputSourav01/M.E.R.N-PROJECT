// require listing model for isowner middleware
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");



// login authentication

module.exports.loggedinAuthentication = (req,res,next)=>{
    console.log(req.user);
    if(! req.isAuthenticated()){       
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , " you mmust have to logged in");
       return res.redirect("/login");
    }
    next();
};
// assign value to cookie
module.exports.saveredirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// middleware to authenticate server request and did if (condition) in show.ejs tempt. for client side authoraisation.
module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)){
          req.flash("error", "You have not a permission to edit or delete!!");
          return res.redirect(`/listings/${id}`);
    }
  next();
}

// middle ware to authenticate server side for delete
module.exports.isReveiwAuthor = async (req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)){
          req.flash("error", "You have not a permission to delete anothers reveiw!!");
          return res.redirect(`/listings/${id}`);
    }
  next();
}