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
    }
}