const jwt = require("jsonwebtoken");
const secrets = require("../secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = secrets.jwtSecret;
  let { userId } = req.params;

    jwt.verify(token, secret, (error, decodedToken) => {
        if(userId !== decodedToken.id) {
            console.log('Requested data does not belong to logged in user.')
            res.status(400).json({ errorMessage: 'Requested data does not belong to logged in user.'})
        } else{
            console.log(`middleware-authenticateRequest: check`)
            next();
        }
    })
};