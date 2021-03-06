const { v4: uuidv4 } = require('uuid');
const db = require('../data/db-config');

module.exports = {
    findRecipeById,
    findRecipeDataByRecipeId,
    findUserRecipes,
    
    insertRecipe,
    insertRecipeImage,
    updateRecipe,
    removeRecipe,

    findStepById,
    findRecipeSteps,
    findAllRecipes,
    insertRecipeStep,
    updateRecipeStep,
    removeRecipeStep,

    findRecipeIngredientsByRecipeId,
    insertRecipeIngredient,
    removeRecipeIngredient

};


// Recipes
async function findAllRecipes() {
    const recipes = await db('recipes')
    console.log('model-findAllRecipes: check')
    return recipes
};

async function findRecipeDataByRecipeId(recipeId) {
    const recipe = await db('recipes').where('id', recipeId)
    const steps = await db('steps').where('recipeId', recipeId)
    const ingredients = await findRecipeIngredientsByRecipeId(recipeId)
    let recipeData = {
        data: {...recipe[0]},
        steps: [...steps],
        ingredients: [...ingredients]
    }

    console.log('findRecipeDataByRecipeId', recipeData)
    return recipeData
}

async function findRecipeById(recipeId) {
    const recipe = await db('recipes').where('id', recipeId).first()
    return recipe
};

async function findUserRecipes(userId) {
    const arr = await db('recipes').where('userId', userId);

    console.log(`model-findUserRecipes: ${arr} - check`)
    return arr;
};

async function insertRecipe(recipeData) {
    console.log(`model-insertRecipe: inserting... ${recipeData.id}`)
    const result = await db('recipes').insert({
        id: recipeData.id,
        userId: recipeData.userId,
        recipeName: recipeData.recipeName,
        description: recipeData.description,
        imageURL: recipeData.imageURL,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        yields: recipeData.yields,
        created: new Date()
    })
   return findUserRecipes(recipeData.userId)
};

async function insertRecipeImage(imageURL, recipeId, userId) {
    console.log('model-insertRecipeImage: inserting... ', imageURL)
    const result = await db('recipes')
        .where('id', recipeId)
        .update({ imageURL })
    return findUserRecipes(userId)
};

async function updateRecipe(recipeData) {
    console.log('model-updateRecipe: updating...')
    console.log(recipeData)
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
        return findUserRecipes(recipeData.userId)
};

async function removeRecipe(recipeId, userId) {
    console.log(`recipeId: ${recipeId}`)
    console.log('model-removeRecipe: removing...')
    let deleted = await db('recipes')
                .where('id', recipeId)
                .del()
    return findUserRecipes(userId)
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
        id: stepData.id,
        recipeId: stepData.recipeId,
        stepNum: stepData.stepNum,
        stepInstruction: stepData.stepInstruction
    }).returning('id')
    return findRecipeSteps(stepData.recipeId)
    
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
            stepInstruction: stepData.stepInstruction
        }).returning('id')
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

            // GET
// Function to find ingredientName with just ingredientId
async function findIngredientNameByIngredientId(ingredientId) {
    const ingredient = await db('ingredients').where('id', ingredientId).first()
    console.log(`model-findIngredientNameByIngredientId - check`)
    const { ingredientName } = ingredient
    return ingredientName
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

//----------------------------------------------------------------

            // POST
async function handleBothIds(foundIngredient, foundMid) {
    console.log('HANDLE BOTH')
    let mid = await db('recipe_ingredients').where({ id: foundMid.id }).first()
    let ingredient = {
        ...foundIngredient,
        amount: mid.amount,
        midId: mid.id,
        recipeId: mid.recipeId
    }
    console.log(`model - handleBothIds: This ingredient is already added to the recipe.`)
    return 'This ingredient is already added to the recipe.'
};

async function handleOneId(foundIngredient, ingredientData) {
    console.log('HANDLE ONE')
    let newMidId = uuidv4()
    console.log(
        newMidId
    )

    let midId = await db('recipe_ingredients')
    .insert({
        id: midId,
        recipeId: ingredientData.recipeId,
        ingredientId: foundIngredient.id,
        amount: ingredientData.amount
    }).returning('id')
    console.log('midId: ', midId)
    let ingredient = {
        ingredientId: foundIngredient.id,
        ingredientName: foundIngredient.ingredientName,
        amount: ingredientData.amount,
        midId: midId[0],
        recipeId: ingredientData.recipeId
    }

    console.log(`model - handleOneId: ${ingredient} - check`)
    return ingredient
};

async function handleNeither(ingredientData) {
    console.log('HANDLE NEITHER')
    let newIngredientId = uuidv4()
    let newMidId = uuidv4()
    console.log(
        newIngredientId,
        newMidId
    )

    let ingredientId = await db('ingredients')
    .insert({
        id: newIngredientId,
        ingredientName: ingredientData.ingredientName
    }).returning('id')
    console.log(`ingredientId${ingredientId[0]}`)
    let midId = await db('recipe_ingredients')
    .insert({
        id: newMidId,
        recipeId: ingredientData.recipeId,
        ingredientId: ingredientId[0],
        amount: ingredientData.amount
    }).returning('id')
    console.log(`midId: ${midId[0]}`)
    let ingredient = {
        ingredientId: ingredientId[0],
        ingredientName: ingredientData.ingredientName,
        amount: ingredientData.amount,
        midId: midId[0],
        recipeId: ingredientData.recipeId
    }

    console.log(`model - handleNeither: ${ingredient} - check`)
    return ingredient
};

// Function to insert an ingredient into a recipe
async function insertRecipeIngredient(ingredientData) {
    console.log(`ENTERING INSERT: `)

    let foundIngredient = await db('ingredients')
    .where({ ingredientName: ingredientData.ingredientName }).first()
    let foundMid = null

    if(foundIngredient) {
        console.log('finding foundMid...')
        foundMid = await db('recipe_ingredients')
        .where({
             ingredientId: foundIngredient.id,
             recipeId: ingredientData.recipeId
            }).first()
        console.log(foundMid)
    }
    
    if(foundIngredient && foundMid) {
        console.log(`recipeId: ${ingredientData.recipeId}, ingredientId: ${foundIngredient.id}, foundMid: ${foundMid.id}`)
        return handleBothIds(foundIngredient, foundMid)
    }

    if(foundIngredient && !foundMid) {
        return handleOneId(foundIngredient, ingredientData)
    }

    if(!foundIngredient && !foundMid) {
        return handleNeither(ingredientData)
    }
};

//-----------------------------------------------------------------

            // DELETE
// Function to remove an ingredient in a recipe
async function removeRecipeIngredient(recipeId, ingredientId) {
    console.log('model-removeRecipeIngredient: removing...')
    console.log(ingredientId, recipeId)
    return db('recipe_ingredients').where({
        ingredientId: ingredientId,
        recipeId: recipeId
    }).del()
}