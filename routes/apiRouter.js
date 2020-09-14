const router = require('express').Router();
const authRouter = require('./authRouter');
const authenticator = require('../middleware/authenticator');
const usersRouter = require('./usersRouter');
const recipesRouter = require('./recipesRouter');
const stepsRouter = require('./stepsRouter');

// GET to check if router is working
router.get('/', (req, res) => {
    res.status(200).json({message: 'you have entered the api router!'})
});

router.use('/auth', authRouter);
router.use('/users', authenticator, usersRouter);
router.use('/recipes', authenticator, recipesRouter);
// router.use('/steps', authenticator, stepsRouter);

module.exports = router;