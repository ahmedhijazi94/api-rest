const express = require('express');
const router = express.Router();
//require todos os controllers
const Controllers = require('../controllers/controllers');

//LOGIN AUTHENTICATION
router.post('/auth', Controllers.authController.controller.authenticate);
//====================================================================================//

//chamar a middleware para permitir apenas logados.
//(TUDO QUE TIVER A BAIXO PRECISA ESTÁ LOGADO)//
const loggedMiddleware = require('../auth/loggedMiddleware');
router.use(loggedMiddleware);
//====================================================================//

//chamar a middleware para verificar se precisa ser admin pra acessar rota
//(CHAMA NO MEIO DO ROUTE)//
const adminMiddleware = require('../auth/adminMiddleware');
//====================================================================//


//USERS
router.post('/users/register', adminMiddleware(Controllers.userController.needAdmin), Controllers.userController.controller.register);
//====================================================================================//






module.exports = router;