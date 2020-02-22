const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {});

// When logout, redirect to client
router.get("/logout", (req, res) => {});

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/auth/login/failed"
  })
);

module.exports = router;

module.exports = router;
