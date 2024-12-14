
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index rout for all listings
module.exports.index =  async (req,res)=>{
    const allListings = await Listing.find({});
    // console.log(allListings);
    
    res.render("listings/index.ejs",{allListings});
}

// ----------------------------------------------------------------------------------------------------------------------
// render form for Addnew post
module.exports.renderNewForm = (req,res)=>{   
    res.render("listings/new.ejs");
}
// save data from newpost form
module.exports.saveNewForm = async(req,res)=>{
    // cordinates mapbox map
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      }).send();
    //   console.log(response.body.features[0].geometry);
    //   res.send("done");

    // save cloud image.
   console.log(req.file)
   let url = req.file.path;
   let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); // assign newListin name to whole body req.
    console.log(newListing);
    // to add owner info before save new post. owner feild info belong to the user id.
    newListing.owner = req.user._id; // assign req.userid in owner feild
    newListing.image = { url , filename};  // assign url and filename value in image feild
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
      req.flash("success","new listing added");   
       res.redirect("/listings");
}


// ------------------------------------------------------------------------------------------------------
// show listings routes 

module.exports.showListing =  async(req,res)=>{
    
    let { id }= req.params;
   const listing= await Listing.findById(id).populate({path:"reviews", populate: { path: "author",} ,}).populate("owner");
   if (!listing){
    req.flash("error","Listings Does not Exist !!");
    res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs",{listing});
}

// ----------------------------------------------------------------------------------------------------
// editform with existing data rout 
module.exports.editListing = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","You Can Update Your Listings Here !!");
    if (!listing){
        req.flash("error","Ops!! may be your listing was deleted!");
        res.redirect("/listings");
    }
    let orignalImage = listing.image.url;
    orignalImage = orignalImage.replace("/upload" , "/upload/e_blur:300/");
    res.render("listings/edit.ejs",{listing , orignalImage});
}
// edit form submission with edited data in existing data
module.exports.editFormSubmission = async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError (400, "please enter valid data");
    }
    let { id } = req.params;
     let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing} );

     if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename };
        await listing.save()
     }
     req.flash("success"," Informations Updated");
     res.redirect(`/listings/${id}`);
}


// ------------------------------------------------------------------------
// delete listing from alllisting
module.exports.deleteListing = async(req,res)=>{
    let { id }=req.params;
    let deltedList=  await Listing.findByIdAndDelete(id);
    req.flash("success","Your Listings is Deleted !");
    res.redirect("/listings");
}