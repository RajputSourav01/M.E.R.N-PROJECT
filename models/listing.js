const { required, number, ref } = require("joi");
const mongoose = require ("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

// for dlt review
const Review= require("./review.js");

// create schema
const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    image:{
        url: String,
        filename: String,  
    },

    price: { type: Number, required: true },


    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    // add new feild
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});


// when a listing dlt review will also dlt middleware
listingSchema.post("findOneAndDelete", async(listing)=>{
if(listing){
   await Review.deleteMany({_id : {$in: listing.reviews}})
}
});

// create model of listingSchema

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;