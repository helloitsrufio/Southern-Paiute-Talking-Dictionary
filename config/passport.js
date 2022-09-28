//we are referencing https://github.com/bradtraversy/storybooks

const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config({ path: "./config/.env" });

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("this is a profile", profile);
        let userEmail = "";
        if (Array.isArray(profile.emails)) {
          let firstEmail = profile.emails[0];
          if (typeof firstEmail === "object" && firstEmail !== null) {
            let emailValue = firstEmail.value;
            if (typeof emailValue === "string") {
              userEmail = emailValue;
            }
          }
        }
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: userEmail,
        };
        console.log("new user: ", newUser);
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
