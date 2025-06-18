const path = require('path')
const fs = require('fs').promises

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Adjust path based on your model location

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://webdev-imsxx.run-ap-south1.goorm.site/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
	const avatarsPath = path.join(__dirname, '..', 'public', 'avatars');
    const avatarFiles = await fs.readdir(avatarsPath)
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
		firstName: profile.name.givenName,
		lastName: profile.name.familyName,
		profilePic: avatarFiles[Math.floor(Math.random() * avatarFiles.length)],
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});