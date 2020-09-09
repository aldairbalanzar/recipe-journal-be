const router = require('express').Router();
const userRouter = require('./routes/userRouter');

// GET to check if route is working
router.get('/', (req, res) => {
    res.status(200).json({message: 'you have entered the api router!'})
});

router.use('/user', userRouter);

module.exports = router