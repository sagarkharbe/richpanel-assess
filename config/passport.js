const TwitterStrategy = require("passport-twitter");
const passport = require("passport");
const keys = require("./keys");

passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL: "/auth/twitter/redirect"
    },
    async (token, tokenSecret, profile, done) => done(null, profile)
  )
);
