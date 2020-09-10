const db = require('../data/db-config');

module.exports = {
    insertUser,
    // findUserById,
    // updateUser,
    // insertRecipe,
    // findRecipeById,
    // updateRecipe,
    // removeRecipe,
    // insertStep,
    // updateStep,
    // removeStep,
    // insertIngredient,
    // updateIngredient,
    // removeIngredient
}

async function insertUser(userData) {
    console.log(`model function: userData has made it to insertUser().`)
    const newUser = await db('users').insert({
        username: userData.username,
        password: userData.password,
        created: Date.now()
    })
    .into('users')
    return newUser
}