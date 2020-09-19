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
    console.log(`middleware-handleUpdateRecipe: check`)
    next()
}

module.exports = handleRecipeData;