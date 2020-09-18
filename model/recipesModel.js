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
async function findMidIdByIds(recipeId, ingredient) {
    if(ingredient.id) {
        let midObject = await db('recipe_ingredients').where({
            recipeId: recipeId,
            ingredientId: ingredient
        }).first()
        console.log(`model-findMidIdByIds - ${midObject} check`)
        return midObject
    } else {
        return null
    }
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

async function insertIngredientData(ingredient) {
    return db('ingredients')
    .insert({
        ingredientName: ingredient.ingredientName
    })
}

async function insertMidData(ingredientId, data) {
    return db('recipe_ingredients')
    .insert({
        recipeId: data.recipeId,
        ingredientId: ingredientId
    })
}

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

// -------------WORK IN PROGRESS

async function handleBothIds(ingredientid, midId) {
    let result = await db('recipe_ingredients').where({
        id: midId,
        ingredientId: ingredientid
    })

    console.log(`model-handleBothIds: ${result} - check`)
    return result
};

async function handleOneId(ingredientId, data) {
    let result = await db('recipe_ingredients').insert({
        ingredientId: ingredientId,
        recipeId: data.recipeId,
        amount: data.amount
    })

    console.log(`model-handleOneId: ${result} - check`)
    return result
};

async function handleNeitherId(data) {
    let ingredientId = db('ingredients').insert({
        ingredientName: data.ingredientName
    })

    console.log(`model-handleNeitherId: ${ingredientId} - check`)
    handleOneId(ingredientId, data)
};


// Function to insert an ingredient into a recipe
async function insertRecipeIngredient(data) {
    console.log('ENTERING INSERT: ')
    return db('ingredients')
    .where({ingredientName: data.ingredientName})
    .then(async (foundIngredients) => {
        console.log(`model-insertRecipe-1: ${foundIngredients}`)
        if(foundIngredients[0]) {
            console.log('***have ingredientId')
            return db('recipe_ingredients')
            .where({ 
                ingredientId: foundIngredients[0].id,
                recipeId: data.recipeId
            })
            .then(async (foundMidIds) => {
            console.log(`model-insertRecipe-2: ${foundMidIds}`)
            if(foundMidIds[0]) {
                console.log('***have both ids')
                handleBothIds(foundIngredients[0], foundMidIds[0])
            } else {
               let midId = await insertMidData(foundMidIds[0].id, data)
               return handleBothIds(foundIngredients[0].id, midId)
            }
            })
        } else {async () => {

            console.log('***have neither ids')
            let ingredientId = await insertIngredientData(data)
            let midId = await insertMidData(ingredientId[0].id, data)
            return handleBothIds(ingredientId, midId)
            }
        }
    })
};

// Function to remove an ingredient in a recipe
async function removeRecipeIngredient(recipeId, ingredientId) {
    console.log('model-removeRecipeIngredient: removing...')
    return db('recipe_ingredients').where({
        ingredientId: ingredientId,
        recipeId: recipeId
    }).del()
}