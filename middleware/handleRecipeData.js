const { v4: uuidv4 } = require('uuid');

function handleRecipeData(req, res, next) {
    let { userId } = req.params;
    let { id, recipeName, description, imageURL, prepTime, cookTime, yields } = req.body;

    req.body.recipeData = {
        id: id,
        userId: userId,
        recipeName: recipeName,
        description: description,
        imageURL: imageURL,
        prepTime: prepTime,
        cookTime: cookTime,
        yields: yields,
        updated: new Date()
    }
    console.log(`middleware-handleRecipeData: check`)
    console.log(`
    id: ${req.body.recipeData.id},
    user_id: ${req.body.recipeData.user_id},
    recipeName: ${req.body.recipeData.recipeName},
    description: ${req.body.recipeData.description},
    imageURL: ${req.body.recipeData.imageURL},
    prepTime: ${req.body.recipeData.prepTime},
    cookTime: ${req.body.recipeData.cookTime},
    yields: ${req.body.recipeData.yields},
    updated: ${req.body.recipeData.updated}
    `)
    next()
}

module.exports = handleRecipeData;