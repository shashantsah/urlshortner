const express=require("express");
const { authenticateUser } = require("../middlewares/auth");
const URL = require("../models/url");
const { handleGenerateNewShortUrl, handleRedirecting } = require("../controllers/url");
const router= express.Router();

router.get("/",authenticateUser,async(req,res)=>{
   
    const allUrls= await URL.find({createdBy:req.user});
    res.render('home',{authenticated:true,urls:allUrls});
});



router.get("/analytics",authenticateUser,(req,res)=>{
    res.render('analytics',{authenticated:true});
});
router.get("/login",(req,res)=>{
    res.render('login',{prompt:""});
})
router.get("/signup",(req,res)=>{
    res.render('signup',{prompt:""});
})
router.get("/reset",(req,res)=>{
    res.render('passwordReset',{prompt:""});
})
router.get("/reset/:token", (req, res) => {
    const token = req.params.token;

    // Log the token to the console
    console.log("Token:", token);

    // Render the set new password page with the token passed to it
    res.render('setnewpassword', { token: token,prompt:"" });
});




module.exports=router;