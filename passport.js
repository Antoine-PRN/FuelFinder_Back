// passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL, // Mettez l'URL de rappel appropriée
    },
    (accessToken, refreshToken, profile, done) => {
      // La logique d'authentification avec Google peut être gérée ici
      return done(null, profile);
    }
  )
);

module.exports = passport;
