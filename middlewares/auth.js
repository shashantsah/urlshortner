function authenticateUser(req, res, next) {
    // Check if userId is set in the session
    if (!req.session.userId) {
        // If userId is not set, redirect to the login page
        
        return res.redirect('/login');
    }
    req.user=req.session.userId;
    // If userId is set, the user is authenticated, so continue to the next middleware/route handler
    next();
}
module.exports={
authenticateUser,
}
