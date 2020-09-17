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
    removeRecipeStep,

    findIngredientDataByMidId,
    findMidIdByIds,
    findIngredientDataByIngredientName,
    findIngredientNameByIngredientId,
    findRecipeIngredientsByRecipeId,
    insertRecipeIngredient,
    insertMidDataToTable,
    removeRecipeIngredient

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
};


// Ingredients

// HELPER functions
// Function to find ingredientId with just ingredientName
async function findIngredientDataByIngredientName(ingredientName) {
    console.log(`ingredientName: ${ingredientName}`)
    const ingredient = await db('ingredients').where({ ingredientName })
    console.log(`model-findIngredientDataByIngredientName - check`)
    if(ingredient.length === 0) {
        return null
    } else {

        return ingredient
    }
};

// Function to find ingredientName with just ingredientId
async function findIngredientNameByIngredientId(ingredientId) {
    const ingredient = await db('ingredients').where('id', ingredientId).first()
    console.log(`model-findIngredientNameByIngredientId - check`)
    const { ingredientName } = ingredient
    return ingredientName
};

// Function to find midId by recipeId and ingredientId
async function findMidIdByIds(recipeId, ingredientId) {
    let midObject = await db('recipe_ingredients').where({
        recipeId: recipeId,
        ingredientId: ingredientId
    }).first()
    console.log(`model-findMidIdByIds - ${midObject} check`)
    return midObject
};

// Function to find ingredient data by midId
async function findIngredientDataByMidId(midId) {
    let ingredient = {}
    const data = await db('recipe_ingredients').where('id', midId).first()

    ingredient.recipe_ingredientsId = data.id,
    ingredient.ingredientId = data.ingredientId,
    ingredient.recipeId = data.recipeId,
    ingredient.ingredientName = await
    findIngredientNameByIngredientId(data.ingredientId)
    ingredient.amount = data.amount

    console.log(`model-findIngredientDataByMidId - check`)
    return ingredient
};

// ---------------------------------------------------------------------------

// Main GET all ingredients
// Function to find all ingredients and data for a recipe
async function findRecipeIngredientsByRecipeId(recipeId) {
    let ingredientList = []
    const mids = await db('recipe_ingredients').where({ recipeId })
    
    for(let i = 0; i < mids.length; i++) {
        let ingredient = await findIngredientDataByMidId(mids[i].id)
        ingredientList.push(ingredient)
    }

    console.log(`model-findRecipeIngredientsByRecipeId - check`)
    return ingredientList
};

// Function to insert ingredient to table and retrieve id
async function insertIngredientToTable(ingredientData) {
    ingredientId =  await db('ingredients').insert({
        ingredientName: ingredientData.ingredientName
    })

    console.log(`model-insertIngredientToTable: ${ingredientId} - check`)
    return ingredientId
};

// Function to insert ids and amount to mid table
async function insertMidDataToTable(ingredientData, ingredientId) {
    console.log(`ingredientId: ${ingredientId}`)
    let { recipeId, amount } = ingredientData
    let midId = await db('recipe_ingredients').insert({
        recipeId: recipeId,
        ingredientId: ingredientId,
        amount: amount
    })

    console.log(`model-insertMidDataToTable: ${midId} - check`)
    return midId
};

// Function to insert an ingredient into a recipe
async function insertRecipeIngredient(ingredientData) {
    console.log('ENTERING INSERT: ')
    let ingredient = null
    
    let { ingredientName, recipeId } = ingredientData
    let foundIngredient = await findIngredientDataByIngredientName(ingredientName)
    let midId = await findMidIdByIds(recipeId, foundIngredient)
    console.log(`midId: ${midId}, recipeId: ${recipeId}, ingredientId: ${foundIngredient}`)

    if(foundIngredient[0].id && midId) {
    console.log('BOTH IDS')
    console.log(`model-insertRecipeIngredient-ingredient - check`)
    return []
    }
    
    // IF not in table, insert ingredientName to table and add ids to mid table
    if(!foundIngredient && !midId) {
        console.log('NEITHER')

        // insert ingredient to table and retrieve id for later use
        let ingredientId = await insertIngredientToTable(ingredientData)
        console.log(`model-insertRecipeIngredient-IF1: ${ingredientId}`)

        // With the ingredientId returned, add it to middle table with recipeId
        let midId = await insertMidDataToTable(ingredientData, ingredientId)
        console.log(`model-insertRecipeIngredient-IF2: ${midId}, ${ingredientId}`)

        ingredient = await findIngredientDataByMidId(midId)
        console.log(`model-insertRecipeIngredient-ingredient: ${ingredient}`)
        return ingredient
    }

    // IF in table, check if recipeId exist with it in mid table
    if(foundIngredient[0].id && !midId) {
        console.log('HAVE ingredientId')

        // retrieve midId that has both ingredientId & recipeId
        let midId = await insertMidDataToTable(ingredientData, foundIngredient[0].id)
        console.log(`model-findMidIdByIngredientId-midId: ${midId}`)
        
        ingredient = await findIngredientDataByMidId(midId)
        console.log(`model-insertRecipeIngredient-ingredient: ${ingredient}`)
        return ingredient
    }
};

// Function to remove an ingredient in a recipe
async function removeRecipeIngredient(recipeId, ingredientId) {
    console.log('model-removeRecipeIngredient: removing...')
    return db('recipe_ingredients').where({
        ingredientId: ingredientId,
        recipeId: recipeId
    }).del()
}