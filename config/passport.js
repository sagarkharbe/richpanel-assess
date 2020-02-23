const TwitterStrategy = require("passport-twitter");
const passport = require("passport");
const keys = require("./keys");

module.exports = passport => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: keys.TWITTER_CONSUMER_KEY,
        consumerSecret: keys.TWITTER_CONSUMER_SECRET,
        callbackURL: "/api/auth/twitter/callback"
      },
      async (token, tokenSecret, profile, done) => done(null, profile)
    )
  );
};
