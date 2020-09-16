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
    findIngredientIdByIngredientName,
    findIngredientNameByIngredientId,
    findRecipeIngredientsByRecipeId,
    insertRecipeIngredient

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

// Function to find ingredientId with just ingredientName
async function findIngredientIdByIngredientName(ingredientName) {
    const ingredientId = await db('ingredients').where({ ingredientName }).first()
    console.log(`model-findIngredientIdByIngredientName - check`)
    return ingredientId
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
    const midId = await db('recipe_ingredients').where({
        recipeId: recipeId,
        ingredientId: ingredientId
    }).first()
    console.log(`model-findMidIdByIds - check`)
    return midId
};

// Function to find ingredient data by midId
async function findIngredientDataByMidId(midId) {
    let ingredient = {}
    const data = await db('recipe_ingredients').where('id', midId).first()

    ingredient.ingredientName = await 
    findIngredientNameByIngredientId(data.ingredientId)
    ingredient.amount = data.amount
    console.log(`model-findIngredientDataByMidId - check`)
    return ingredient
};

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

async function insertRecipeIngredient(ingredientData) {
    let ingredient = null
    
    // First check if ingredient already exists in ingredients table
    let { ingredientName } = ingredientData
    let ingredientId = await findIngredientIdByIngredientName(ingredientName)
    console.log(`model-ingredientId: ${ingredientId}`)
    
    // IF not in table, insert ingredientName to table and add ids to mid table
    if(!ingredientId) {
        let ingredientId = await db('ingredients').insert({
            ingredientName: ingredientData.ingredientName
        })
        console.log(`ingredients insert: ${ingredientId}`)

        // With the ingredientId returned, add it to middle table with recipeId
        let midId = await db('recipe_ingredients').insert({
            recipeId: ingredientData.recipeId,
            ingredientId: ingredientId,
            amount: ingredientData.amount
        })
        console.log(`recipe_ingredients insert: ${midId}`)
        ingredient = await findIngredientDataByMidId(midId)
        console.log(`model-insertRecipeIngredient-ingredient: ${ingredient}`)
        return ingredient
    }

    // IF in table, check if recipeId exist with it in mid table
    if(ingredientId) {
        let midId = findMidIdByIds(recipeId, ingredientId)
        console.log(`model-findMidRelationByIngredientId-midId: ${midId}`)
        
        // IF not in mid table, just insert ids and data into it
        if(!midId) {
            let midId = await db('recipe_ingredients').insert({
                recipeId: ingredientData.recipeId,
                ingredientId: ingredientId,
                amount: ingredientData.amount
            })

            console.log(`model-insertRecipeIngredient-id: ${midId}`)
            ingredient = await findIngredientDataByMidId(id)
            console.log(`model-insertRecipeIngredient-ingredient: ${ingredient}`)
            return ingredient
        } else {
            console.log('model-insertRecipeIngredient: That ingredient already exists in this recipe.')
            return findIngredientDataByMidId(midId)
        }
    }
};