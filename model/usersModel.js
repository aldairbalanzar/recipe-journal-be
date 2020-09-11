const db = require('../data/db-config');

module.exports = {
    insertUser,
    findUserByUsername,
    findUserById,
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
async function findUserByUsername(username) {
    const user = await db('users').where(username)

    console.log('usersModel-findUserByUsername: check')
    return user
};

async function insertUser(userData) {
    const id = await db('users').insert({
        username: userData.username,
        password: userData.password,
        created: Date.now()
    }).into('users')
    console.log('usersModel-insertUser: check')
    return findUserById(id)
};


async function findUserById(userId) {
    const user = await db('users').where('id', userId).first()
    return user
}

async function updateUserData(userId, changes) {
    const id = await db('users')
        .where('id', userId)
        .update({
            username: changes.username,
            password: changes.password
        })
        console.log('model-updateUserData: check')
        return findUserById(id)
};

function removeUser(userId) {
    console.log('model-removeUser: removing...')
    return db('users')
        .where('id', userId)
        .del()
};