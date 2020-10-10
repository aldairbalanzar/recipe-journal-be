const { v4: uuidv4 } = require('uuid');

function handleRecipeData(req, res, next) {
    let { userId } = req.params;
    let { id, recipeName, description, imageURL, prepTime, cookTime, yields } = req.body;

    req.body.recipeData = {
        id: uuidv4(),
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
    next()
}

module.exports = handleRecipeData;