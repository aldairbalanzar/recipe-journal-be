const jwt = require("jsonwebtoken");
const secrets = require("../secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = secrets.jwtSecret;

  if (token) {
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        console.log('No valid token.')
        res.status(401).json({ message: "No valid token." });
      } else {
        req.decodedToken = decodedToken;
        next();
      }})
  } else {
    console.log('Please provide credentials')
    res.status(400).json({ message: "Please provide credentials." });
  }
};