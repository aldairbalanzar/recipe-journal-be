const db = require('../data/db-config');

module.exports = {
    findRecipeById,
    findUserRecipes,
    insertRecipe,
    updateRecipe,
    removeRecipe,
    findStepById,
    findRecipeSteps,
    findAllRecipes,
    insertRecipeStep,
    updateRecipeStep,
    removeRecipeStep
};


// Recipes
async function findAllRecipes() {
    const recipes = await db('recipes')
    console.log('model-findAllRecipes: check')
    return recipes
}

async function findRecipeById(recipeId) {
    const recipe = await db('recipes').where('id', recipeId).first()
    return recipe
};

async function findUserRecipes(userId) {
    const arr = await db('recipes').where('userId', userId);

    let recipes = [...arr]
    for(let i = 0; i < arr.length; i++){
        let recipeId = arr[i].id;
        recipes[i] = await findRecipeById(recipeId);
    }
    console.log('model-findUserRecipes: check')
    return recipes;
};

async function insertRecipe(recipeData) {
    console.log('model-insertRecipe: inserting...')
    const result = await db('recipes').insert({
        userId: recipeData.userId,
        recipeName: recipeData.recipeName,
        description: recipeData.description,
        imageURL: recipeData.imageURL,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        yields: recipeData.yields,
        created: Date.now()
    }).into('recipes')
   return findUserRecipes(recipeData.userId)
};

async function updateRecipe(recipeData) {
    console.log('model-updateRecipe: updating...')
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


// Steps
async function findStepById(stepId) {
    const step = await db('steps').where('id', stepId)
    console.log('model-findStepById: check')
    return step
};

async function findRecipeSteps(recipeId) {
    const steps = await db('steps').where('recipeId', recipeId)
    console.log('model-findUserRecipes: check')
    return steps
};

async function insertRecipeStep(stepData) {
    console.log('model-insertRecipeStep: inserting...')
    const id = await db('steps').insert({
        recipeId: stepData.recipeId,
        stepNum: stepData.stepNum,
        stepInstruction: stepData.instruction
    })
    return findStepById(id)
    
};

async function updateRecipeStep(stepData) {
    console.log('model-updateRecipeStep: updating...')
    console.log(stepData)
    const result = await db('steps')
        .where({
            id: stepData.id,
            recipeId: stepData.recipeId
        })
        .update({
            stepNum: stepData.stepNum,
            stepInstruction: stepData.instruction
        })
        console.log(`RESULT: ${result}`)
        return findRecipeSteps(stepData.recipeId)
};

function removeRecipeStep(stepId) {
    console.log('model-removeRecipeStep: removing...')
    return db('steps')
        .where('id', stepId)
        .del()
}