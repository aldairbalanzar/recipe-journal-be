function handleUserData(req, res, next) {
    const { username, password } = req.body;

    req.body.userData = {
        username: username,
        password: password
    }
    console.log(`middleware-handleUserData: check`)
    next()
}

module.exports = handleUserData;