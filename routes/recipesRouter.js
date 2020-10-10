const router = require('express').Router();
const authenticateRequest = require('../middleware/authenticateRequest');
const handleIngredientData = require('../middleware/handleIngredientData');
const handleRecipeData = require('../middleware/handleRecipeData');
const handleUpdateRecipe = require('../middleware/handleUpdateRecipe');
const handleStepData = require('../middleware/handleStepData');
const handleUpdateStep = require('../middleware/handleUpdateStep');
const Recipes = require('../model/recipesModel');
const cloudinary = require('cloudinary').v2;
const cloudinaryConfig = require('../cloudinaryConfig');


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
        res.status(200).json({ message: 'Here are your recipes.', recipes })
    })
    .catch(err => {
        console.log(`/recipes/userId-GET-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not get recipes, something went wrong...' })
    })

});

router.get('/:userId/:recipeId', authenticateRequest, (req, res) => {
    let { recipeId } = req.params;

    Recipes.findRecipeDataByRecipeId(recipeId)
    .then(recipe => {
        console.log(`findRecipeDataByRecipeId: ${recipe}`)
        console.log(recipe)
        res.status(200).json({ message: 'Here is that recipe!', recipe })
    })
    .catch(err => {
        console.log(`/recipes/userId/recipeId-GET-catch: ${err}`)
        res.status(500).json({ errorMessage: 'Could not get that recipe, something went wront...' })
    })
})

router.post('/:userId', authenticateRequest, handleRecipeData, (req, res) => {
    let { recipeData } = req.body

    
    console.log(recipeData)
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

router.put('/:userId', authenticateRequest, handleUpdateRecipe, (req, res) => {
    let { recipeData } = req.body

    Recipes.updateRecipe(recipeData)
    .then(recipes => {
        console.log(`
        updatedRecipe: UPDATED!`)
        res.status(201).json({ message: 'Recipe has been updated!', recipes})
    })
    .catch(err => {
        console.log(`/recipes/userId-PUT-catch: ${err}`)
        res.status(500).json({ errorMessage:'Could not update recipe, something went wrong...'})
    })
});

// For recipe image
router.put('/:userId/:recipeId/image', authenticateRequest, (req, res) => {
    console.log('INSERTING IMAGE...')
    console.log('files: ', req.files)
    console.log('body: ', req.body)
    
    let { imageFile } = req.params

    console.log('\n***FILE: ', imageFile);

    cloudinary.uploader.upload(imageFile.tempFilePath, (err, result) => {
        console.log('result: ', result)
        console.log('url: ', result.url)
        let imageURL = result.url
        Recipes.insertRecipeImage(imageURL, recipeId)
        .then( recipes => {
            console.log('recipes: ', recipes)
            res.status(201).json({ message: 'Recipe has been updated!', recipes })
        })
        .catch(err => {
            console.log('/recipes/userId/recipeId/image', err)
            res.status(500).json({ errorMessage: 'Recipe image could not be added... someting went wrong.', err })
        })
    });
})

router.delete('/:userId/:recipeId', authenticateRequest, (req, res) => {
    let { recipeId, userId } = req.params

    Recipes.removeRecipe(recipeId, userId)
    .then(recipes => {
        console.log('Recipe deleted!')
        res.status(200).json({ message: 'Recipe successfuly deleted.', recipes })
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
    .then(steps => {
        console.log(`
        Step added!
            ${steps}`)
        res.status(201).json({ message: 'Step successfuly added to recipe!', steps})
    })
    .catch(err => {
        console.log(`/recipes/userId/recipeId/steps: ${err}`)
        res.status(500).json({ errorMessage: 'Could not add that step to the recipe, something went wrong...', err })
    })
});

router.put('/:userId/:recipeId/steps', authenticateRequest, handleUpdateStep, (req, res) => {
    let { stepData } = req.body

    Recipes.updateRecipeStep(stepData)
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
router.get('/:recipeId/ingredients', (req, res) => {
    let { recipeId } = req.params

    Recipes.findRecipeIngredientsByRecipeId(recipeId)
    .then(ingredients => {
        console.log(`
        Ingredients found!
            ingredients:
            ${ingredients.length}
        `)
        res.status(200).json({ message: 'Recipe ingredients found!', ingredients })
    })
    .catch(err => {
        console.log(`/recipeId/ingredients-GET: ${err}`)
        res.status(500).json({ errorMessage: 'Could not get the ingredients to that recipe, something went wrong...'})
    })
});

router.post('/:userId/:recipeId/ingredients', authenticateRequest, handleIngredientData, (req, res) => {
    const { recipeId } = req.params
    const { midId, ingredientName, amount } = req.body.ingredientData
    let ingredientData = {
        midId: midId,
        recipeId: recipeId,
        ingredientName: ingredientName,
        amount: amount
    }
    console.log(`POST ROUTE: ${ingredientData}`)
    Recipes.insertRecipeIngredient(ingredientData)
    .then(response => {
        if(typeof(response) === 'string') {
            console.log(`/userId/recipeId/ingredients: ${response}`)
            res.status(400).json({ message: 'This ingredient is already added to the recipe.' })
        } else {
            console.log(`
            Ingredient added!:
            ${response}
            `)
            res.status(200).json({ message: 'Ingredient successfuly added to recipe.', response })
        }
    })
    .catch(err => {
        console.log(`/userId/recipeId/ingredients-POST: ${err}`)
        res.status(500).json({ errorMessage: 'Could not add ingredient to that recipe.', err })
    })
});

router.delete('/:userId/:recipeId/ingredients/:ingredientId', authenticateRequest, (req, res) => {
    let { recipeId, ingredientId } = req.params

    Recipes.removeRecipeIngredient(recipeId, ingredientId)
    .then(response => {
        if(response === 0) {
            console.log(`/userId/recipeId/ingredients: ${response}`)
            res.status(200).json({ message: 'That ingredient is not in this recipe.' })
        } else {
            console.log(`
             Ingredient deleted:
                 ${response[0]}
             `)
             res.status(201).json({ message: 'Ingredient successfuly deleted!' })
        }
    })
    .catch(err => {
        console.log(`/userId/recipeId/ingredients/ingredientId-DELETE: ${err}`)
        res.status(500).json({ errorMessage: 'Could not delete that ingredient, something went wrong...', err})
    })
});

module.exports = router;