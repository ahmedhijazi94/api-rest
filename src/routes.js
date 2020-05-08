const express = require('express');
const routes = express.Router();

const Controllers = require('../controllers/controllers');

routes.post('/users/register' , Controllers.userController.controller.register);





module.exports = routes;