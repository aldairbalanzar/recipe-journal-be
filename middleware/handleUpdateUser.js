const bcrypt = require('bcryptjs');

function handleUpdateUser(req, res, next) {
    const rounds = process.env.HASH_ROUNDS || 6;
    const hash = bcrypt.hashSync(req.body.password, rounds);

    req.body.password = hash
    console.log('middleware-handleUpdateUser: check')
    next()
}

module.exports = handleUpdateUser;