//CHAMAR MODELS USER E ROLE
const User = require('../models/').User;
const Role = require('../models').Role;
//========================================//
//CHAMAR PACKAGES BCRYPT E JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//=======================================//
//CHAMAR O AUTHCONFIG QUE CONTÉM O SECRET PRO JWT
const authConfig = require('./auth.json');
//========================================//
//CRIANDO A FUNCTION authenticate.
module.exports = {
    async authenticate(req, res){
        //pegar login e senha do formulario
        const {login, password} = req.body;
        //pesquisa se existe user com esse login
        const user = await User.findOne({where: {login : login}, include: [Role]});
        //se não existir retorna erro
        if(!user){
            return res.status(400).send('error: User not found');
        }
        //se user tiver com status inativo retorna erro
        if(user.status != 'active'){
            return res.status(400).send('error: Inactive user')
        }
        //se a senha não bater, retorna erro
        if(! await bcrypt.compare(password, user.password)){
            return res.status(400).send('error: Invalid password');
        }
        //verifica se é admin
        const role = user.Role.role;
        let isAdmin = null;
        if(role == "Admin"){
            isAdmin = true;
        }else{
            isAdmin = false;
        }
        //remover password da resposta retornada para o cliente
        user.password = undefined;
        //gerar token jwt
        const token = jwt.sign({id: user.id, isAdmin: isAdmin}, authConfig.secret, {
            expiresIn: 86508
        });
        //retorna para o cliente
        res.send({user, token})
    }
}