const bcrypt = require('bcryptjs');

function hashPassword(req, res, next) {
    let { username, password } = req.body
    const rounds = process.env.HASH_ROUNDS || 6;

    if(username === undefined || password === undefined) {
        console.log('middleware: either username or password is undefined.')
        res.status(400).json({ errorMessage: 'please provide required user data.'})
    } else {
        const hash = bcrypt.hashSync(req.body.password, rounds);
        req.body.password = hash
        console.log('middleware-hashPassword: check')
        next()
    }
}

module.exports = hashPassword;