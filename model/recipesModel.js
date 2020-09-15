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
    findIngredientByName,
    findIngredientById,
    findRecipeId,
    findIngredientsByRecipeId,
    insertRecipeIngredient,
    findIngredientData
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
async function findRecipeId(recipeId) {
    const id = await db('recipe_ingredients').where({ recipeId })
    console.log(`model-findRecipeId: ${id}`)
    return id
};

async function findIngredientByName(ingredientName) {
    const ingredient = await db('ingredients').where({ ingredientName }).first()
    console.log(`model-findIngredientByName: ${ingredient}`)
    return ingredient
};

async function findIngredientById(ingredientId) {
    const ingredient = await db('ingredients').where('id', ingredientId).first()
    console.log(`model-findIngredientById: ${ingredient}`)
    const { ingredientName } = ingredient
    return ingredientName
 };


 async function findIngredientData(id) {
     const data = await db('recipe_ingredients').where({ id }).first()
     console.log(data)
     let foundName = await findIngredientById(data.ingredientId)
     console.log(`FOUND NAME: ${foundName}`)
     let ingredientData = {
         ingredientName: foundName,
         amount: data.amount
     }
     console.log(`model-findMidTableData: ${ingredientData}`)
     return ingredientData
 }

async function findIngredientsByRecipeId(recipeId) {
    const ids = await db('recipe_ingredients').where({ recipeId })
    console.log(`ids: ${ids}`)

    let ingredient = {}
    let ingredientList = []
    for(let i = 0; i < ids.length; i++) {
        ingredient.ingredientName = findIngredientById(ids[i].recipeId)
        ingredient.amount = ids[i].amount
        ingredientList.push(ingredient)
    }
    console.log(`
    ingredients:
        ${ingredientList}
    `)
    return ingredientList
};

async function insertRecipeIngredient(ingredientData) {
    let ingredient = null
    let search = await findIngredientByName(ingredientData.ingredientName)
    console.log(`model-search: ${search[0]}`)
    
    if(!search) {
        let ingredientId = await db('ingredients').insert({
            ingredientName: ingredientData.ingredientName
        })
        console.log(`ingredients insert: ${ingredientId}`)
        let id = await db('recipe_ingredients').insert({
            recipeId: ingredientData.recipeId,
            ingredientId: ingredientId,
            amount: ingredientData.amount,
            created: Date.now()
        })
        console.log(`recipe_ingredients insert: ${id}`)
        ingredient = await findIngredientData(id)
        return ingredient
    }

    if(search) {

    }
};