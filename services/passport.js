const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      /*console.log("access token", accessToken);
      console.log("refres token", refreshToken);*/
      console.log("profile", profile);
      User.findOne({ googleId: profile.id })
        .then(existingUser => {
          if (existingUser) {
            // User currently exists
            done(null, existingUser);
          } else {
            // New user
            new User({ googleId: profile.id })
              .save()
              .then(user => done(null, user))
              .catch(error => {
                assert.isNotOk(error, "Promise error");
              });
          }
        })
        .catch(error => {
          assert.isNotOk(error, "Promise error");
        });
    }
  )
);
