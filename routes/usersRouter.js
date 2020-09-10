const router = require('express').Router();
const Users = require('../model/usersModel');
const handleUserData = require('../middleware/handleUserData');

router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will register and login.`})
});

// route to register a new user
router.post('/', (req, res) => {
    let userData = handleUserData(req.body)

    if(userData.username === undefined || userData.password === undefined) {
        console.log('either username or password is undefined')
        res.status(400).json({ message: 'please provide required user data.' })
        return 
    }

    Users.insertUser(userData)
    .then(response => {
        console.log(`new user's id: ${response}`)
        res.status(201).json({ message: 'successfuly registered!',  id: response[0] })
    })
    .catch(err => {
        console.log(`usersRouter POST-catch: ${err}`)
        res.status(500).json({ errorMessage: err.message })
    })
})

module.exports = router;