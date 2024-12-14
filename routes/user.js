const express = require ("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../midlwerAuthenti.js");





//// requiring controller--------------------------------------------------------------
const userController = require("../controller/user.js");
//// signup form and their submission-------------------------------------------------
//* router.get("/signup", userController.singnupForm );
//* router.post("/signup", wrapAsync (userController.submitSignForm));

//// login form and their submission---------------------------------------------------------------------
//* router.get("/login" , userController.loginForm);
//* router.post("/login", saveredirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash:true,}), userController.loginSubmission);
//* router.get("/logout" , userController.logoutUser);



// ----------------------------------------------------------------------------------------------------------
// new way to compact the code using Router.route() = its use for same path having diffrent diffrent request.---------------------------------------------------------
// for("/signup") path which have 2 type of request : get and post
router.route("/signup")
.get( userController.singnupForm )
.post( wrapAsync (userController.submitSignForm));
// for ("/login") path wich have 2 req. : get and post
router.route("/login")
.get( userController.loginForm)
.post( saveredirectUrl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash:true,}), userController.loginSubmission);
// for ("/logout") path
router.route("/logout")
.get( userController.logoutUser);







module.exports = router;