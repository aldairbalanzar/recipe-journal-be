function handleRecipeData(req, res, next) {
    let { userId } = req.params;
    let { recipeName, description, imageURL, prepTime, cookTime, yields } = req.body;

    req.body.recipeData = {
        user_id: userId,
        recipeName: recipeName,
        description: description,
        imageURL: imageURL,
        prepTime: prepTime,
        cookTime: cookTime,
        yields: yields
    }
    console.log(`middleware-handleRecipeData: check`)
    next()
}

module.exports = handleRecipeData;