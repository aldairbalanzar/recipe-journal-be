const router = require('express').Router()

router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will register and login.`})
});

module.exports = router;