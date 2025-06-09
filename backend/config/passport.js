const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user')
const UserProfile = require('../models/userProfile')
const TwitterStrategy = require("passport-twitter").Strategy


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email']
  },
  async function(accessToken, refreshToken, profile, done) {

    console.log(profile)
    if (!UserProfile || !UserProfile.findOne) {
        throw new Error('UserProfile model is not properly imported');
      }

      let user = await UserProfile.findOne({ 
        $or: [
          { userId: profile.id },
          { email: profile.emails[0].value } // Cherche aussi par email si fourni
        ]
      });

    if (!user) {
      user = new UserProfile({
      userId: profile.id,
      displayName: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
    });

      await user.save()
    }
    done(null, user); // ← Important : fournissez l'utilisateur
  }
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "oob",
  includeEmail: true // request email from Twitter if it is available
},
  function(token, tokenSecret, profile, done) {
    if (profile.emails[0]){
      profile.email = profile.emails[0].value
    }
    // Mongo stuff
    return done(null, profile)
  }
))

// To match the user with sessions
passport.serializeUser((user, done) => {
  done(null, user); // Stocke l'objet user complet
});

passport.deserializeUser((user, done) => {
  done(null, user); // Récupère l'objet user complet
});