const { v4: uuidv4 } = require('uuid');

function handleStepData(req, res, next) {
    let { recipeId } = req.params
    let { id, stepNum, stepInstruction } = req.body;

    req.body.stepData = {
        id: uuidv4(),
        recipeId: recipeId,
        stepNum: stepNum,
        stepInstruction: stepInstruction
    }
    console.log(`middleware-handleStepData: check`)
    console.log(`
    id: ${req.body.stepData.id},
    recipeId: ${req.body.stepData.recipeId},
    stepNum: ${req.body.stepData.stepNum},
    stepInstruction: ${req.body.stepData.stepInstruction}
    `)
    next()
}

module.exports = handleStepData;