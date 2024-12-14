const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// now define user schema

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
    },
});
// we have not mentioned username and password in schema becoz pasprtlclmongs will add it autometically with hash and salted value

// now add plugin it will add username and paswrd auto.

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

