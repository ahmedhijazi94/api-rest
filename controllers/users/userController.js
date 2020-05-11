const User = require('../../models').User;
const Role = require('../../models').Role;
const bcrypt = require('bcrypt');


module.exports = {
    async register(req, res){
       const {login, email, password, role} = req.body;
       try {
           //checa se login existe.
           if(await User.findOne({where: {login : login}})){
               return res.status(400).send('User already exists.');
           }
           //checa se email existe
           if(await User.findOne({where: {email: email}})){
                return res.status(400).send('E-mail already exists.');
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
                user.password = undefined;
                res.send({user, role});
           }
           return;
           
       } catch (error) {
           res.status(400).send('error: Registration Failed.')
       }
    },
    async update(req, res){
        //pega os dados do usuario logado
        const loggedIsAdmin   = req.isAdmin;
        const loggedId        = req.userId;
        const loggedLogin     = req.loggedLogin;
        const loggedEmail     = req.loggedEmail;
        //=======================================//
        //pega o id do usuario que vai ser alterado
        const userToChangeId  = req.params.id;
        //======================================//
        //pega os dados do formulario (req.body)
        const {email, login, password, role} = req.body;
       //===============================================//
        //validações
        try {
            //se tiver informado login no formulario 
            if(login){
                //checa se o login informado no formulario é diferente do login que tá logado
                if(login != loggedLogin){
                    //se não for igual, pesquisa se o nome de login informado já existe no banco
                    if(await User.findOne({where: {login : login}})){
                        return res.status(400).send('Login already exists.');
                    }
                }
            }
            //se tiver informado email no formulario 
            if(email){
                //checa se o email informado no formulario é diferente do email que tá logado
                if(email != loggedEmail){
                    //se não for igual, pesquisa se o email informado já existe no banco
                    if(await User.findOne({where: {email: email}})){
                        return res.status(400).send('E-mail already exists.');
                    }
                }
            }

            return res.send('ready to go')
           
        } catch (error) {
            
        }
    }
}