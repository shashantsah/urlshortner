const User = require("../models/user");
const crypto = require('crypto'); // Node.js built-in module for cryptographic operations
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'shashant.sah@gmail.com', // Your Gmail email address
        pass: 'nlkc fsuz klae bgmq' // Your Gmail password
    }
});
// Async function to handle password reset
async function handleResetPassword(req, res) {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            // If user not found, render forgot password page with error message
            return res.render("passwordReset", { prompt: "Email address not found. Please try again." });
        }

        // Generate a unique token for the password reset link
        const token = crypto.randomBytes(20).toString('hex');

        // Update user record with the generated token and expiry time (e.g., token expiry in 1 hour)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds
        await user.save();

        // Send an email to the user with a link containing the token
        await transporter.sendMail({
            from: 'shashant.sah@gmail.com', // Your Gmail email address
            to: email,
            subject: 'Password Reset Request',
            text: `Hello,
            You are receiving this email because you (or someone else) has requested to reset the password for your account.
            If you initiated this request, please click on the following link or copy and paste it into your browser to complete the password reset process:
            http://${req.headers.host}/reset/${token}
            If you did not request this password reset, please ignore this email, and your password will remain unchanged.
            Thank you!`
        });

        // Render a success message to the user
        res.render("passwordReset", { prompt: "Password reset link sent to your email. Please check your inbox." });
    } catch (err) {
        // Handle errors
        console.error("Error during password reset:", err);
        res.render("passwordReset", { prompt: "Unable to process your request. Please try again later." });
    }
}

async function handleLogOut(req, res) {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                // Handle error if session destruction fails
                console.error('Error destroying session:', err);
                return res.send('Internal Server Error');
            }
            // Redirect the user to the login page after logout
            res.redirect(302, '/login'); // Use a valid HTTP status code (e.g., 302 for temporary redirect)
        });
    } catch (err) {
        // Handle any other errors
        console.error('Error logging out:', err);
        res.send('Internal Server Error');
    }
}


async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email and password
        const user = await User.findOne({ email, password });

        if (!user) {
            // If user not found, render login page with error message
            return res.render("login", { prompt:"Invalid email or password" });
        }

        // Set user session data
        req.session.userId = user._id;
       
        
        // Redirect to homepage or dashboard
        res.redirect('/');
    } catch (err) {
        // Handle errors
        console.error("Error during login:", err);
        res.render("login", { prompt:"unable to check in database"});
    }
}


async function handleSignUp(req, res) {
    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If user already exists, redirect to login page with a prompt
            return res.render("login", {prompt:"already signed up please login" });
        }

        // Create a new user
        await User.create({
            name,
            email,
            password,
        });

        // Redirect to homepage after successful signup
        res.redirect('/');
    } catch (err) {
        // Handle errors
        res.render("signup", {prompt:"unable to create id" });
    }
}


async function handlesetNewPassword(req, res) {
    try {
        const token=req.params.token;
        const {  password, confirmPassword } = req.body;
        
        // Check if password and confirm password match
        // if (password !== confirmPassword) {
        //     return res.render("setnewpassword", { token,prompt: "Password and confirm password do not match." });
        // }
        
        // Find the user by the reset token and check if it's valid
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            // If user not found or token expired, render an error message
            return res.render("passwordReset", { prompt: "Password reset link is invalid or has expired." });
        }

        // Update the user's password and clear the reset token and expiry fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Render a success message to the user
        res.render("login", { token,prompt: "Your password has been successfully reset. Please Login now" });
    } catch (err) {
        // Handle errors
        console.error("Error setting new password:", err);
        res.render("setnewpassword", { token,prompt: "Unable to process your request. Please try again later." });
    }
}



module.exports = {
    handleLogin,
    handleSignUp,
    handleLogOut,
    handleResetPassword,
    handlesetNewPassword
};
