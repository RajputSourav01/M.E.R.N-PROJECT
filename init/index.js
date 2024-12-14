const mongoose = require ("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

const initDB = async () =>{
    await Listing.deleteMany({});
    // ADD owner feild on existing data
   initData.data= initData.data.map((obj)=>({...obj, owner: "674602391af2194824d6079e"}));
    // module export of data.js 
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();