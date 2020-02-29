const Twit = require("twit");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
module.exports = (io, app) => {
  const createTwitClient = (key, secret) => {
    return new Twit({
      consumer_key: keys.TWITTER_CONSUMER_KEY,
      consumer_secret: keys.TWITTER_CONSUMER_SECRET,
      timeout_ms: 60 * 1000,
      access_token: keys.TWITTER_ACCESS_TOKEN,
      access_token_secret: keys.TWITTER_ACCESS_TOKEN_SECRET
    });
  };

  io.on("connection", socket => {
    socket.on("register_screen_name", data => {
      let { term: searchTerm, jwtToken } = data;
      let user = jwt.decode(jwtToken, keys.JWT_SECRET).user;
      socket.join(searchTerm);
      stream(searchTerm, user);
    });
  });

  const stream = (searchTerm, user) => {
    const twitter = createTwitClient(
      user.access_token,
      user.access_token_secret
    );
    console.log("Streaming for-", `@${searchTerm}`);
    let stream = twitter.stream("statuses/filter", {
      track: `@${searchTerm}`
    });
    stream.on("tweet", tweet => {
      console.log("New Tweet Recieved");
      sendMessage(tweet, searchTerm);
    });

    stream.on("error", error => {
      console.log(chalk.red("ERROR AT STREAMING - ", error));
    });
  };

  /**
   * Emits data from stream.
   * @param {String} msg
   */
  const sendMessage = (msg, searchTerm) => {
    if (msg.text.includes("RT")) {
      return;
    }
    io.to(searchTerm).emit("tweets", msg);
  };
};
