const router = require('express').Router();


// check router connection 
router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will interact with users route.`})
});


module.exports = router;