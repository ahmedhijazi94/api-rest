//call all controllers here

const Controllers = {
    userController : {
        needAdmin: true,
        controller: require('./users/userController')
    },
    authController:{
        needAdmin: false,
        controller: require('../auth/authController')
    }
}

module.exports = Controllers;