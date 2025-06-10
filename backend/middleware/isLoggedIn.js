async function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Log in successful")
        return next();
    }
    console.log("Are you logged in?")
    res.redirect('/');
}

module.exports = isLoggedIn