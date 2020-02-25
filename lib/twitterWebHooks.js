const twitterWebhooks = require("twitter-webhooks");
const keys = require("../config/keys");
let userActivityWebhook = {};
// crete a Activity Webhook
exports.setUserActivityWebhook = function(app) {
  userActivityWebhook = twitterWebhooks.userActivity({
    serverUrl: keys.SERVER_URL,
    route: "/",
    consumerKey: keys.TWITTER_CONSUMER_KEY,
    consumerSecret: keys.TWITTER_CONSUMER_SECRET,
    accessToken: keys.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: keys.TWITTER_ACCESS_TOKEN_SECRET,
    environment: "dev",
    app
  });
  userActivityWebhook.register();
};

// subscribe to activity webhook
exports.userActivityWebhook = function({
  user_id,
  oauth_token,
  oauth_token_secret
}) {
  return userActivityWebhook.subscribe({
    userId: user_id,
    accessToken: oauth_token,
    accessTokenSecret: oauth_token_secret
  });
};

//Unsubscribe to activity webhook
exports.userUnsubscribe = function({
  user_id,
  oauth_token,
  oauth_token_secret
}) {
  // Subscribe for a particular user activity
  return userActivityWebhook.unsubscribe({
    userId: user_id,
    accessToken: oauth_token,
    accessTokenSecret: oauth_token_secret
  });
};

// return the activity webhook
exports.getAccountWebHook = function() {
  return userActivityWebhook.getWebhook();
};
