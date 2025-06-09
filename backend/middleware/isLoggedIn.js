async function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Log in successful")
        return next();
    }
    if (process.env.DEV_MODE == 'debug') {
        return next();
    }
    console.log("Are you logged in?")
    res.redirect('/');
}

module.exports = isLoggedIn