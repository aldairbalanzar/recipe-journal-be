const router = require('express').Router();
const authRouter = require('./routes/authRouter');
const authenticator = require('./middleware/authenticator');
const recipesRouter = require('./routes/recipesRouter');

// GET to check if router is working
router.get('/', (req, res) => {
    res.status(200).json({message: 'you have entered the api router!'})
});

router.use('/auth', authRouter);
router.use('/recipes', authenticator, recipesRouter);

module.exports = router;