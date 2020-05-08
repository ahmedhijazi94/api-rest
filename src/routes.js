const express = require('express');
const routes = express.Router();

const Controllers = require('../controllers/controllers');


//USERS
routes.post('/users/register' , Controllers.userController.controller.register);

//====================================================================================//

//LOGIN AUTHENTICATIONS
routes.post('/auth', Controllers.authController.controller.authenticate);



module.exports = routes;