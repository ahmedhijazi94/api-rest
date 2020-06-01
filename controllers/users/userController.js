const User = require('../../models').User;
const Role = require('../../models').Role;
const bcrypt = require('bcrypt');


module.exports = {
    async register(req, res){
       const {name, login, email, password, role, status} = req.body;
       try {
           if(await !name || !login || !email || !password || !role || !status){
               return res.status(400).send('Informe os dados do Usuário');
           }
           //checa se login existe.
           if(await User.findOne({where: {login : login}})){
               return res.status(400).send('error: User already exists.');
           }
           //checa se email existe
           if(await User.findOne({where: {email: email}})){
                return res.status(400).send('error: E-mail already exists.');
           }
           //encriptando a senha.
           const hash = await bcrypt.hash(password, 10);
           req.body.password = hash;
           //criar user e atribuir role
           User.create(req.body).then(user => addRole(user));
           //chamar addRole
           addRole = (user) =>{
               Role.create({
                   userid: user.id,
                   role: role
               }).then(role => returnUserRole(user, role))
           };
           //retornar usuario e role
           returnUserRole = (user, role) =>{
               //não enviar a senha no res.
                user.password = undefined;
                res.send({user, role});
           }
           return;
           
       } catch (error) {
           res.status(400).send('error: User registration failed.')
       }
    },
    async readAll(req, res){
        //pegando as params query do url
        let {page = 1, perPage = 10} = req.query;
        //configurando page inserida na url
        if(page > 0){
            page = page - 1;
        }
        //convertando pra integer
        page = parseInt(page);
        perPage = parseInt(perPage);
        //função pra formatar users
        responseUsers = (users, page, perPage) =>{
            //pagination info===============================//
            const num_pages = Math.ceil(users.count/perPage);
            let current_page;
            if (page > 0){
                current_page = current_page - 1;
            }else{
                current_page = 1;
            }
            usersInfo = {
                pagination:{
                    current_page : current_page,
                    num_pages: num_pages,
                    per_page: perPage
                } 
            }
            //=========================================//
            //adiciona pagination info a resposta
            Object.assign(users, usersInfo);
            res.send(users);
        }
        //pegar os users
         User.findAndCountAll({offset: page*perPage, limit: perPage, subQuery:false, include: [Role], order: [['name', 'ASC']]}).then(user => responseUsers(user, page, perPage));
    },
    async readOne(req, res){
        //pega os dados do usuario logado
        const loggedIsAdmin   = req.isAdmin;
        const loggedId        = req.userId;
        //=======================================//
        //pega o id do user que vai ser pesquisado
        const userToGet  = req.params.id;
        //======================================//
        //função pra responder o usuario (NÃO ADMIN)
        getUser = (user) =>{
            user.status = undefined;
            user.role = undefined;
            res.send(user);
        }
        //se não for admin
        if(!await loggedIsAdmin){
            //proibir se tentar pegar outro usuario
            if(loggedId != userToGet){
                return res.status(400).send('error: No permission to get other user.');
            }
            //se for o usuario logado, repondder com a função getUser que trata o usuario para o não admin
            return User.findOne({where: {id: userToGet}}).then(user =>  getUser(user))
        }
        //se for admin, mostrar usuario
        return User.findOne({where: {id: userToGet}, include: [Role]}).then(user =>  res.send(user));
    },
    async update(req, res){
        //pega os dados do usuario logado
        const loggedIsAdmin   = req.isAdmin;
        const loggedId        = req.userId;
        //=======================================//
        //pega o id do usuario que vai ser alterado
        const userToChangeId  = req.params.id;
        //======================================//
        //pega os dados do formulario (req.body)
        const {email, login, password, role, status} = req.body;
       //===============================================//
       //seta variavel padrão isRole (se precisa alterar role ou não : true/false);
       let isRole;
       //========================================================================//
       //se tiver password no formulário, encrpita ele
        if(password){
            const teste =  await bcrypt.hash(password, 10);
            req.body.password = teste;
        }
        //=================================================//

       //função de alteração para ser chamada a baixo
        updateUser = (isRole) =>{
            User.findOne({where: {id: userToChangeId}}).then(user => User.update(req.body, {where: {id: userToChangeId}}).then(updateRole(isRole, user)))
        }
        //validação final (se precisa alterar Role ou não)
        updateRole = (isRole, user) =>{
            if(isRole){
               return Role.update(req.body, {where: {userid: user.id}}).then(res.send('User updated.'))
            }
            return res.status(200).send('User updated.');
        }
       //=================================================//

        //validações
        try {
            //SE O LOGADO É ADMIN
            if(await loggedIsAdmin){
                //se tiver informado login no formulario 
                if(await login){
                    //pesquisa user com login informado
                    const user = await User.findOne({where: {login: login }});
                    //se existir
                    if(await user){
                        //checa se userId do usuario pesquisado é diferente do usuario a ser alterado
                        //(SE NÃO FOR IGUAL É PQ O LOGIN INFORMADO TA SENDO USADO POR OUTRO USUARIO)
                        if(user.id != userToChangeId){
                            //retorna erro que login ja existe
                            return res.status(400).send('error: Login already exists.');
                        }
                        //next ==>
                    }
                }
                if(await email){
                    //pesquisa user com email informado
                    const user = await User.findOne({where: {email: email }});
                    //se existir
                    if(await user){
                        //checa se userId do usuario pesquisado é diferente do usuario a ser alterado
                        //(SE NÃO FOR IGUAL É PQ O EMAIL INFORMADO TA SENDO USADO POR OUTRO USUARIO)
                        if(user.id != userToChangeId){
                            //retorna erro que email ja existe
                            return res.status(400).send('error: E-mail already exists.');
                        }
                        //next ==>
                    }
                }
                //se tiver alteração de Role no formulário
                if(await role){
                    //seta para true
                    isRole = true;
                    //chama a função de alteração de usuario com isRole true
                    return updateUser(isRole);
                }
                //se não tiver Role no formulario
                isRole = false;
                //chama função de alteração de usuario com isRole false
                return updateUser(isRole);
            }

            //SE O LOGADO NÃO FOR ADMIN
            //se nao for admin, não poder alterar outro usuario que não seja ele.
            if(!await loggedIsAdmin){
                if(loggedId != userToChangeId){
                    return res.status(400).send('error: No permission for changing other user.');
                }
            }
            //proibir permissão de trocar Role se não for Admin
            if(await role){
                return res.status(400).send('error: No permission for changing the Role.');
            }
            //proibir permissão de trocar Status se não for Admin
            if(await status){
                return res.status(400).send('error: No permission for changing the status.');
            }
            //se tiver informado login no formulario 
            if(await login){
                //checa se o login informado no formulario é diferente do login que tá logado
                const userLogged = await User.findOne({where: {id: loggedId}});
                if(login != userLogged.login){
                    //se não for igual, pesquisa se o nome de login informado já existe no banco
                    if(await User.findOne({where: {login : login}})){
                        return res.status(400).send('Login already exists.');
                    }
                }
            }
            //se tiver informado email no formulario 
            if(await email){
                //checa se o email informado no formulario é diferente do email que tá logado
                const userLogged = await User.findOne({where: {id: loggedId}});
                if(email != userLogged.email){
                    //se não for igual, pesquisa se o email informado já existe no banco
                    if(await User.findOne({where: {email: email}})){
                        return res.status(400).send('E-mail already exists.');
                    }
                }
            }
            //SE TIVER TUDO OK (USUARIO SEM SER ADMIN)
            isRole = false;
            //chama função de alteração de usuario com isRole false
            return updateUser(isRole);
            //===========================================================================================//
        } catch (error) {
            return res.send('erro: User updated failed.');
        }
    },
    async delete(req, res){
        //pegar o id do user a ser deletado
        const userToDeleteId = req.params.id;
        //pesquisar user com esse id
        const user = await User.findOne({where: {id: userToDeleteId}});
        //se existir, apagar user e o role dele
        if(user){
            return User.destroy({where: {id: userToDeleteId}}).then(Role.destroy({where: {userid: userToDeleteId}}).then(res.send('User ['+user.login+'] has been deleted.')))
        }
        //se não, retornar erro
        return res.status(400).send('error: User not found');
    }
}