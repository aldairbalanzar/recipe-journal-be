const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../secrets')
const Users = require('../model/usersModel');
const handleUserData = require('../middleware/handleUserData');
const hashPassword = require('../middleware/hashPassword');

// check router connection 
router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will register and login.`})
});

// route to register a new user
router.post('/register', hashPassword, handleUserData, (req, res) => {
    let { userData } = req.body

    Users.insertUser(userData)
    .then(newUser => {
        delete newUser.password
        console.log(`
        Registered user!
            id: ${newUser.id}
            username: ${newUser.username}`)
        res.status(201).json({ message: 'successfuly registered!',  user: newUser })
    })
    .catch(err => {
        console.log(`/-POST-catch: ${err}`)
        res.status(500).json({ errorMessage: err.message })
    })
});

// route to login
router.post('/login', handleUserData, (req, res) => {
    let { username, password } = req.body.userData

    Users.findUserByUsername({username})
    .then(user => {
        let { id, username, token } = handleloggedInUser(user[0], password)
        console.log(`
        logged in!
            id: ${id},
            username: ${username}
        `)
        res.status(200).json({ message: 'successfuly logged in!', id, username, token })
    })
    .catch(err => {
        console.log(`/login-POST-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not log user in, something went wrong...', error: err.message })
    })
});


// abstracted functions
function generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
    };
    const secret = secrets.jwtSecret;
    const options = {
      expiresIn: 1000 * 60 * 1
    };
    
    console.log('generateToken: check')
    return jwt.sign(payload, secret, options);
  };

function handleloggedInUser(user, password) {
    if(user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)

        const loggedInUser = {
            id: user.id,
            username: user.username,
            token: token
        }

        console.log('handleLoggedInUser: check')
        return loggedInUser
    } else {
        console.log('handleLoggedInUser - could not log in with provided credentials.')
        return
    }
};


module.exports = router;