const express = require('express');
const passport = require('passport');
const router = express.Router();


// Login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Callback (what happens when Google is done processing)
router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/', 
    successRedirect: '/dashboard'
  })
);

// router.get('/auth/twitter',
//   passport.authenticate('twitter', { scope: ['profile', 'email'] })
// );

// router.get('/auth/twitter/callback', 
//   passport.authenticate('twitter', { 
//     failureRedirect: '/', 
//     successRedirect: '/dashboard'
//   })
// );

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback', 
  passport.authenticate('github', { 
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