const express=require("express");
const { handleLogin, handleSignUp,handleLogOut,handleResetPassword,handlesetNewPassword } = require("../controllers/user");
const router=express.Router();
router.post('/signup',handleSignUp);
router.post('/login',handleLogin);
router.post('/logout',handleLogOut);
router.post('/reset',handleResetPassword);
router.post('/reset/:token',handlesetNewPassword);


module.exports=router;