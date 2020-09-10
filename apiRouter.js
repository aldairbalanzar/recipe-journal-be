const router = require('express').Router();
const usersRouter = require('./routes/usersRouter');

// GET to check if route is working
router.get('/', (req, res) => {
    res.status(200).json({message: 'you have entered the api router!'})
});

router.use('/users', usersRouter);

module.exports = router