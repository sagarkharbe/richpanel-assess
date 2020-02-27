module.exports = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://twitter-rp.herokuapp.com"
      : "http://localhost:5000"
};
