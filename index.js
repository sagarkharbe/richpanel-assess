const express = require("express");
const session = require("express-session");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const http = require("http");
const chalk = require("chalk");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const keys = require("./config/keys");
//const helmet = require('helmet')

//create express application
const app = express();

/**
 * MIDDLEWARES
 */

app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);

// parse cookies
app.use(cookieParser());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

//passport authentication strategy for twitter
// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "../../client/build/")));

//making body available to read in request object
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Redirect to api routes
app.use("/api", require("./routes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const server = http.createServer(app);
const port = process.env.PORT || 5000;

//add socket.io connection later

server.listen(port, () =>
  console.log(chalk.magenta(`server eavesdropping on port ${port}`))
);
