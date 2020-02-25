const router = require("express").Router();
const userAuth = require("../../middleware/authPermissions");
const { twitterController } = require("../../controllers");

router.get("/self", userAuth, twitterController.getUserDetails);

router.get("/tweets", userAuth, twitterController.getMentionedTweets);

router.post("/postReplies", userAuth, twitterController.postReplies);

module.exports = router;
