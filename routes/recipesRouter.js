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
});

router.put('/:userId', authenticateRequest, handleRecipeData, (req, res) => {
    let { recipeData } = req.body

    Recipes.updateRecipe(recipeData)
    .then(updatedRecipe => {
        console.log(`
        updatedRecipe:
            id: ${updatedRecipe.id},
            user_id: ${updatedRecipe.user_id},
            recipeName: ${updatedRecipe.recipeName},
            description: ${updatedRecipe.description},
            imageURL: ${updatedRecipe.imageURL},
            prepTime: ${updatedRecipe.prepTime},
            cookTime: ${updatedRecipe.cookTime},
            yields: ${updatedRecipe.yields},
            updated: ${updatedRecipe.updated}

    `)
        res.status(201).json({ message: 'Recipe has been updated!', updatedRecipe})
    })
    .catch(err => {
        console.log(`/recipes/userId-PUT-catch: ${err}`)
        res.status(500).json({ errorMessage:'Could not update recipe, something went wrong...'})
    })
});

router.delete('/:userId/:recipeId', authenticateRequest, (req, res) => {
    let { recipeId } = req.params

    Recipes.removeRecipe(recipeId)
    .then(response => {
        console.log('Recipe deleted!')
        res.status(200).json({ message: 'Recipe successfuly deleted.', response })
    })
    .catch(err => {
        console.log(`/userId/recipeId-DELETE-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not delete that recipe, something went wrong...' })
    })
});

module.exports = router;