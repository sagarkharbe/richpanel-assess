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

  let socketConnection;
  let twitterStream;

  const stream = () => {
    console.log("Streaming for-", `@${app.locals.searchTerm}`);
    let stream = twitter.stream("statuses/filter", {
      track: `@${app.locals.searchTerm}`
    });
    stream.on("tweet", tweet => {
      console.log("New Tweet Recieved");
      sendMessage(tweet);
    });

    stream.on("error", error => {
      console.log(chalk.red("ERROR AT STREAMING - ", error));
    });
  };

  app.use("/setSearchTerm", (req, res) => {
    let term = req.body.term;
    app.locals.searchTerm = term;
    twitterStream.destroy();
    stream();
  });

  io.on("connection", socket => {
    socketConnection = socket;
    stream();
    socket.on("connection", () => console.log("Client connected"));
    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  /**
   * Emits data from stream.
   * @param {String} msg
   */
  const sendMessage = msg => {
    if (msg.text.includes("RT")) {
      return;
    }
    socketConnection.emit("tweets", msg);
  };
};
