const router = require('express').Router();
const authenticateRequest = require('../middleware/authenticateRequest');

// check router connection 
router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will interact with steps route.` })
});



module.exports = router;