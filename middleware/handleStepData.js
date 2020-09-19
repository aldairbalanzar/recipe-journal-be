const { v4: uuidv4 } = require('uuid');

function handleStepData(req, res, next) {
    let { recipeId } = req.params
    let { stepNum, stepInstruction } = req.body;

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
    instruction: ${req.body.stepData.instruction}
    `)
    next()
}

module.exports = handleStepData;