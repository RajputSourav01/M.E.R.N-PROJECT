// require user schema from model folder
const User = require ("../models/user");



// signup form---------------------------------------------------------------
module.exports.singnupForm =  (req,res)=>{
    res.render("users/signup.ejs");
}
// signup submission request
module.exports.submitSignForm = async(req,res)=>{
    try{
    let { username , email, password} = req.body;
    const newUser= new User({ email , username});
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err)=>{
        if(err){
            req.flash("error", "something went wrong");
            return next(err);
        }
        req.flash("success" , "Welcome To WonderLust");
    res.redirect("/listings");
    });
    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


// login form---------------------------------------------------------------------------------
module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}
// login submission
module.exports.loginSubmission = async(req,res)=>{
    req.flash("success", "welcome back after login!!");
    let redirectDir = res.locals.redirectUrl || "/listings";
    res.redirect(redirectDir);
}
// logout --------------------------------------------------------------------------------
module.exports.logoutUser = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are succesfully logOut!");
        res.redirect("/listings");
    });
}