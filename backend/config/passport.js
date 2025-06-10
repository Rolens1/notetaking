const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user')
const UserProfile = require('../models/userProfile')


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
    done(null, user);
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email']
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log(profile);

    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        const queryConditions = [{ userId: profile.id }];
        if (email) {
            queryConditions.push({ email: email });
        }

        let user = await UserProfile.findOne({ $or: queryConditions });

        if (!user) {
            user = new UserProfile({
                userId: profile.id, 
                displayName: profile.displayName || profile.username,
                name: profile.displayName || profile.username,
                email: email
            });
            await user.save();
        }
        
        // 3. On passe l'utilisateur à Passport pour la session
        return done(null, user);

    } catch (err) {
        return done(err);
    }
  }
));



// To match the user with sessions
passport.serializeUser((user, done) => {
  done(null, user); // Stocke l'objet user complet
});

passport.deserializeUser((user, done) => {
  done(null, user); // Récupère l'objet user complet
});