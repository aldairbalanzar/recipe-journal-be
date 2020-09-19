const { v4: uuidv4 } = require('uuid');

function handleUserData(req, res, next) {
    const { username, password } = req.body;

    req.body.userData = {
        id: uuidv4(),
        username: username,
        password: password
    }
    console.log(`middleware-handleUserData: check`)
    next()
}

module.exports = handleUserData;