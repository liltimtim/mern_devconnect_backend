// Passport Strategy Configuration

const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

let opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtSecret;

// the passed in value
module.exports = passport => {
  passport.use(
    new JWTStrategy(opts, async (payload, done) => {
      const { id } = payload;
      let user = await User.findById(id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
  );
};
