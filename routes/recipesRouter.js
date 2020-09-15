const router = require('express').Router();
const authenticateRequest = require('../middleware/authenticateRequest');
const handleRecipeData = require('../middleware/handleRecipeData');
const handleStepData = require('../middleware/handleStepData');
const { findIngredientByName } = require('../model/recipesModel');
const Recipes = require('../model/recipesModel');


// Recipes
router.get('/', (req, res) => {
    Recipes.findAllRecipes()
    .then(recipes => {
        console.log('Recipes found!')
        res.status(200).json({ message: 'Here are the recipes.', recipes})
    })
    .catch(err => {
        console.log(`/recipes-GET: ${err}`)
        res.status(500).json({ errorMessage: 'Could not get recipes, something went wrong...'})
    })
})

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
        res.status(500).json({ errorMessage: 'Could not get recipes, something went wrong...'})
    })

});

router.post('/:userId', authenticateRequest, handleRecipeData, (req, res) => {
    let { recipeData } = req.body;
    
    Recipes.insertRecipe(recipeData)
    .then(recipes => {
        let newRecipe = recipes[recipes.length - 1]
        console.log(`
        created recipe!
            user_id: ${newRecipe.userId}
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
            user_id: ${updatedRecipe.userId},
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

// Steps
router.get('/:recipeId/steps', (req, res) => {
    let { recipeId } = req.params

    Recipes.findRecipeSteps(recipeId)
    .then(response => {
        console.log(`
        Found steps!
        number of steps: ${response.length}`)
        res.status(200).json({ message: 'Recipe steps found!', response})
    })
    .catch(err => {
        console.log(`/steps/recipeId-GET: ${err}`)
        res.status(500).json({ errorMessage: 'Could not get the steps to that recipe, something went wrong...'})
    })
});

router.post('/:userId/:recipeId/steps', authenticateRequest, handleStepData, (req, res) => {
    let { stepData } = req.body

    Recipes.insertRecipeStep(stepData)
    .then(response => {
        console.log(`
        Step added!
            ${response}`)
        res.status(201).json({ message: 'Step successfuly added to recipe!', response})
    })
    .catch(err => {
        console.log(`/recipes/userId/recipeId/steps: ${err}`)
        res.status(500).json({ errorMessage: 'Could not add that step to the recipe, something went wrong...', err })
    })
});

router.put('/:userId/:recipeId/steps/:stepId', authenticateRequest, handleStepData, (req, res) => {
    let { stepId } = req.params
    let { stepData } = req.body

    Recipes.updateRecipeStep(stepData, stepId)
    .then(response => {
        if(response > 0){
            console.log(`
            Found steps!
            number of steps: ${response.length}`)
            res.status(201).json({ message: 'Step successfuly updated!', response})
        } else {
            console.log(`Recipe updated!`)
            res.status(400).json({ message: 'Recipe successfuly updated!', response})
        }
    })
    .catch(err => {
        console.log(`/recipes/userId/recipeId/steps-PUT-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not update that step, something went wrong...', err})
    })
});

router.delete('/:userId/steps/:stepId', authenticateRequest, (req, res) => {
    let { stepId } = req.params

    Recipes.removeRecipeStep(stepId)
    .then(response => {
        console.log(`
        Step deleted!
        `)
        res.status(200).json({ message: 'Step successfuly deleted!', response })
    })
    .catch(err => {
        console.log(`/recipes/userId/steps/stepId: ${err}`)
        res.status(500).jsong({ errorMessage: 'Could not delete that step, something went wrong...' })
    })
})


// Ingredients
// get recipe's ingredients
router.get('/:recipeId/ingredients', (req, res) => {
    let { recipeId } = req.params

    Recipes.findIngredientsByRecipeId(recipeId)
    .then(response => {
        console.log(`
        response:
        ${response}
        `)
        res.status(200).json({ message: 'GET ingredients', response })
    })
    .catch(err => {
        console.log(`/recipeId/ingredients-GET: ${err}`)
        res.status(500).json({ errorMessage: 'Could not get the ingredients to that recipe, something went wrong...'})
    })
});

// post recipe's ingredients
router.post('/:userId/:recipeId/ingredients', authenticateRequest, (req, res) => {
    const { recipeId } = req.params
    const { ingredientName, amount } = req.body
    let ingredientData = {
        recipeId: recipeId,
        ingredientName: ingredientName,
        amount: amount
    }
    Recipes.insertRecipeIngredient(ingredientData)
    .then(response => {
        console.log(`
        response:
        ${response[0]}
        `)
        res.status(200).json({ message: 'POST ingredients', response })
    })
    .catch(err => {
        console.log(`/userId/recipeId/ingredients-POST: ${err}`)
        res.status(500).json({ errorMessage: 'Could not add ingredient to that recipe.', err })
    })
});

// put recipe's ingredients
router.put('/:userId/:recipeId/ingredients/:ingredientId', (req, res) => {
    console.log('PUT ingreditnes')
    res.status(200).json({ message: 'PUT ingredients' })
});

// delete recipe's ingredients
router.delete('/:userId/:recipeId/ingredients/:ingredientId', (req, res) => {
    console.log('DELETE ingredients')
    res.status(201).json({ message: 'DELETE ingredients'})
});

module.exports = router;