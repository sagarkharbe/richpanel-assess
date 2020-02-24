const twitterWebhook = require("../lib/twitterWebHooks");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

module.exports = {
  newConnection: () => {
    global.io.on("connection", socket => {
      socket.io("authenticare", async data => {
        const userData = jwt.decode(data.token, JWT_SECRET);
        await twitterWebhook.userUnsubscribe(userData);
        const userActivityWebhook = twitterWebhook.userActivityWebhook(
          userData
        );
        userActivityWebhook
          .then(userActivity => {
            userActivity.on("tweet_create", data => socket.emit("newTweets"));
          })
          .catch(err => console.log("Error in Socket Conn -- ", error));
      });
    });
  },
  emitOverSocketId: (socketId, eventName, data) => {
    global.io.to(`${socketId}`).emit(eventName, data);
  }
};
