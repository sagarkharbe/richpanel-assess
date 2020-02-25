module.exports = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "https://twitter-rp.herokuapp.com"
      : "http://192.168.0.107:5000"
};
