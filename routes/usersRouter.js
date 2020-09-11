const router = require('express').Router();
const authenticateRequest = require('../middleware/authenticateRequest');
const handleUserData = require('../middleware/handleUserData');
const handleUpdateUser = require('../middleware/handleUpdateUser');
const Users = require('../model/usersModel');
const { updateUserData } = require('../model/usersModel');


// check router connection 
router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will interact with users route.`})
});

router.put('/:userId', authenticateRequest, handleUpdateUser, handleUserData, (req, res) => {
    let { userData } = req.body;
    let { userId } = req.params;

    Users.updateUserData(userId, userData)
    .then(updatedUser => {
        delete updatedUser.password
        console.log(`
        User updated!
            username: ${updatedUser.username}
        `)
        res.status(201).json({ message: 'User has been updated.', updatedUser })
    })
    .catch(err => {
        console.log(`/users/userId-PUT-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not update user, something went wrong...', err})
    })
});

router.delete('/:userId', authenticateRequest, (req, res) => {
    let { userId } = req.params;

    Users.removeUser(userId)
    .then(response => {
        console.log(`
        User deleted!
            id: ${response}
        `)
        res.status(200).json({ message: 'Successfuly deleted user.', response })
    })
    .catch(err => {
        console.log(`/users/userId-DELETE-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not delete that user, something went wrong...', err })
    })
})

module.exports = router;