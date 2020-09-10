function handleUserData(reqBody) {
    const { username, password } = reqBody;

    let userData = {
        username: username,
        password: password
    }

    console.log(`
    middleware:
        username: ${userData.username}
        password: ${userData.password}
        `)

        return userData
}

module.exports = handleUserData;