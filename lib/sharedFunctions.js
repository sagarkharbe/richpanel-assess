const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

module.exports = {
  makeJsonString: data =>
    JSON.parse(
      '{"' +
        data
          .split("=")
          .join('":"')
          .split("&")
          .join('","') +
        '"}'
    ),

  createToken: payload =>
    jwt.sign({ user_id: payload }, JWT_SECRET, { expiresIn: "3 days" })
};
