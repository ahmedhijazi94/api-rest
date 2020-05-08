const User = require('../models/').User;
const Role = require('../models/').Role;

//chama adminMiddleware com parametro se precisa de admin
const adminMiddleware = (needAdmin) => {
    return  function middleware(req, res, next){
        //se precisar de admin
        if(needAdmin){
            //pega id do usuario logado
            const userId = req.userId;
            //pesquisa o role dele e chama a função check admin
            User.findByPk(userId, {include: [Role]}).then(user => checkAdmin(user));
            //se role for admin libera ação se não, retorna erro
            return checkAdmin = (user) =>{
               const role = user.Role.role;
               if(role != "Admin"){
                    return res.status(401).send('Erro: Unauthorized');
               }
               return next();
            }
        }
        return next();
    }
}

module.exports = adminMiddleware;


