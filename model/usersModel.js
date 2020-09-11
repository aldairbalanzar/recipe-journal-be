const db = require('../data/db-config');

module.exports = {
    insertUser,
    findUserByUsername,
    updateUserData,
    removeUser,
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
    const newUser = await db('users').insert({
        username: userData.username,
        password: userData.password,
        created: Date.now()
    }).into('users')
    console.log('usersModel-insertUser: check')
    return newUser
};

async function findUserByUsername(username) {
    const user = await db('users').where(username)

    console.log('usersModel-findUserByUsername: check')
    return user
};

function updateUserData(userId, changes) {
    console.log('model-updateUserData: updating...')
    return db('users')
        .where('id', userId)
        .update(changes)
};

function removeUser(userId) {
    console.log('model-removeUser: removing...')
    return('users')
        .where('id', userId)
        .del()
};