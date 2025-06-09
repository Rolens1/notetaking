const express = require('express');
const passport = require('passport');
const router = express.Router();


// Login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// router.get("/postman/auth/google", (req, res) => {
//   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent("http://localhost:3000/auth/google/callback")}&scope=profile email`;
  
//   res.json({ 
//     authUrl, // À utiliser dans Postman ou une app mobile
//     method: "GET" 
//   });
// });

// Callback (what happens when Google is done processing)
router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/', 
    successRedirect: '/dashboard'
  })
);

router.get('/auth/twitter',
  passport.authenticate('twitter', { scope: ['profile', 'email'] })
);

router.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { 
    failureRedirect: '/', 
    successRedirect: '/dashboard'
  })
);


// Logging out
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;