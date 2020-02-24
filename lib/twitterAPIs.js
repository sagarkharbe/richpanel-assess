const Twit = require("twit");
const keys = require("../config/keys");

const twitterClient = function(token, secret) {
  const client = new Twit({
    consumer_key: keys.TWITTER_CONSUMER_KEY,
    consumer_secret: keys.TWITTER_CONSUMER_SECRET,
    timeout_ms: 60 * 1000,
    access_token: token,
    access_token_secret: secret
  });

  return {
    getUserDetails() {
      return client.get("/account/verify_credentials", {});
    },
    mentionedTweets() {
      return client.get("/statuses/mentions_timeline");
    },
    postReplies(params) {
      return client.post("/statuses/update", params);
    }
  };
};

module.exports = twitterClient;
