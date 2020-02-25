const twitterWebhook = require("../lib/twitterWebHooks");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const chalk = require("chalk");

module.exports = {
  newConnection: () => {
    global.io.on("connection", socket => {
      console.log(chalk.red("CONNECTION"));
      socket.on("authenticate", async data => {
        console.log(chalk.red("AUTHEN"));
        const { user: userData } = jwt.decode(data.token, JWT_SECRET);
        //try {
        await twitterWebhook.userUnsubscribe(userData);
        // } catch (err) {
        //   console.log(chalk.red("ERROR", JSON.stringify(err.body.errors)));
        // }

        const userActivityWebhook = await twitterWebhook.userActivityWebhook(
          userData
        );

        userActivityWebhook
          .then(function(userActivity) {
            userActivity.on("tweet_create", data => {
              socket.emit("newTweets");
              console.log("New Tweets   - - --  -");
            });
          })
          .catch(error => console.log("error in socket", error));
      });
    });
  },
  emitOverSocketId: (socketId, eventName, data) => {
    global.io.to(`${socketId}`).emit(eventName, data);
  }
};
