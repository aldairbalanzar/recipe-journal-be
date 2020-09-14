function handleStepData(req, res, next) {
    let { stepId, recipeId } = req.params
    let { stepNum, instruction } = req.body;

    req.body.stepData = {
        id: stepId,
        recipeId: recipeId,
        stepNum: stepNum,
        instruction: instruction
    }
    console.log(`middleware-handleStepData: check`)
    console.log(`
    recipeId: ${req.body.stepData.recipeId},
    stepNum: ${req.body.stepData.stepNum},
    instruction: ${req.body.stepData.instruction}
    `)
    next()
}

module.exports = handleStepData;