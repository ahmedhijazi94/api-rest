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

//USERS CRUD
//========>>>
//CREATE
router.post('/users/register', adminMiddleware(Controllers.userController.needAdmin), Controllers.userController.controller.register);
//READ
router.get('/users', adminMiddleware(Controllers.userController.needAdmin), Controllers.userController.controller.readAll);
router.get('/users/user/:id', Controllers.userController.controller.readOne);
//UPDATE
router.put('/users/user/:id', Controllers.userController.controller.update);
//DELETE
router.delete('/users/user/:id', adminMiddleware(Controllers.userController.needAdmin), Controllers.userController.controller.delete);
//====================================================================================================================================//


router.get('*', (req, res) =>{
    res.send('404')
})

module.exports = router;