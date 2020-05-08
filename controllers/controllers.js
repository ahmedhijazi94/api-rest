//call all controllers here

const Controllers = {
    userController : {
        needAdmin: true,
        controller: require('./users/userController')
    }
}

module.exports = Controllers;