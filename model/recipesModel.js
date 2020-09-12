const db = require('../data/db-config');

module.exports = {
    findRecipeById,
    findUserRecipes,
    insertRecipe,
    updateRecipe,
    removeRecipe
}
async function findRecipeById(recipeId) {
    const recipe = await db('recipes').where('id', recipeId).first()
    console.log('model-findRecipeById: check')
    return recipe
};

async function findUserRecipes(userId) {
    const arr = await db('recipes')
        .where('user_id', userId);

    let recipes = [...arr]
    for(let i = 0; i < arr.length; i++){
        let recipeId = arr[i].id;
        recipes[i] = await findRecipeById(recipeId);
    }
    console.log('model-findUserRecipes: check')
    return recipes;
};

async function insertRecipe(recipeData) {
    const result = await db('recipes').insert({
        user_id: recipeData.user_id,
        recipeName: recipeData.recipeName,
        description: recipeData.description,
        imageURL: recipeData.imageURL,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        yields: recipeData.yields,
        created: Date.now()
    }).into('recipes')
   return findUserRecipes(recipeData.user_id)
};

async function updateRecipe(recipeData) {
    const result = await db('recipes')
        .where('id', recipeData.id)
        .update({
            recipeName: recipeData.recipeName,
            description: recipeData.description,
            imageURL: recipeData.imageURL,
            prepTime: recipeData.prepTime,
            cookTime: recipeData.cookTime,
            yields: recipeData.yields,
            updated: recipeData.updated
        })
        return findRecipeById(recipeData.id)
};

function removeRecipe(recipeId) {
    console.log('model-removeRecipe: removing...')
    return db('recipes')
        .where('id', recipeId)
        .del()
};

