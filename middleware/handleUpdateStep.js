function handleUpdateStep(req, res, next) {
    let { userId } = req.params
    let { id, stepNum, stepInstruction } = req.body

    req.body.stepData = {
        id: id,
        stepNum: stepNum,
        stepInstruction: stepInstruction
    }
    console.log(`middleware-handleUpdateStep: ${req.body.stepData} - check`)
    next()
}

module.exports = handleUpdateStep;