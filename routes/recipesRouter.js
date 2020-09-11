const router = require('express').Router();
const authenticateRequest = require('../middleware/authenticateRequest');
const handleRecipeData = require('../middleware/handleRecipeData');
const Recipes = require('../model/recipesModel');


// check router connection 
router.get('/', (req, res) => {
    res.status(200).json({ message: `this is where we will interact with recipes route.` })
});

router.get('/:userId', authenticateRequest, (req, res) => {
    let { userId } = req.params;

    Recipes.findUserRecipes(userId)
    .then(recipes => {
        console.log(`
        found recipes!
            recipes: ${recipes}
        `)
        res.status(200).json({ message: 'Here are your recipes.', recipes})
    })
    .catch(err => {
        console.log(`/recipes/userId-GET-catch: ${err}`)
    })

});

router.post('/:userId', authenticateRequest, handleRecipeData, (req, res) => {
    let { recipeData } = req.body;
    
    Recipes.insertRecipe(recipeData)
    .then(recipes => {
        let newRecipe = recipes[recipes.length - 1]
        console.log(`
        created recipe!
            user_id: ${newRecipe.user_id}
            recipeName: ${newRecipe.recipeName}
            description: ${newRecipe.description}
            imageURL: ${newRecipe.imageURL}
            prepTime: ${newRecipe.prepTime}
            cookTime: ${newRecipe.cookTime}
            yields: ${newRecipe.yields}
        `)
        res.status(201).json({ message: 'Successfuly created recipe!', recipes})
    })
    .catch(err => {
        console.log(`/recipes/userId-POST-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not create recipe, something went wrong...', err})
    })
})

module.exports = router;