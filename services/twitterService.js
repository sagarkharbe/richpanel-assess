const Twit = require("twit");
const keys = require("../config/keys");
const chalk = require("chalk");
module.exports = (io, app) => {
  const twitter = new Twit({
    consumer_key: keys.TWITTER_CONSUMER_KEY,
    consumer_secret: keys.TWITTER_CONSUMER_SECRET,
    timeout_ms: 60 * 1000,
    access_token: keys.TWITTER_ACCESS_TOKEN,
    access_token_secret: keys.TWITTER_ACCESS_TOKEN_SECRET
  });

  io.on("connection", socket => {
    socket.on("register_screen_name", data => {
      let searchTerm = data.term;
      socket.join(searchTerm);
      stream(searchTerm);
    });
  });

  const stream = searchTerm => {
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
