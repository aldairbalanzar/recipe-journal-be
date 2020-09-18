function handleIngredientData(req, res, next) {
    let { recipeId, ingredientId } = req.params;
    let { amount, ingredientName } = req.body;

    req.body.ingredientData = {
        ingredientId: ingredientId,
        recipeId: recipeId,
        ingredientName: ingredientName,
        amount: amount
    }
    console.log(`middleware-handleIngredientData: check`)
    // console.log(req.body.ingredientData)
    next()
}

module.exports = handleIngredientData;