const User = require('../../models').User;
const bcrypt = require('bcrypt');

module.exports = {
    async register(req, res){
       const {login, email, password} = req.body;
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
           //criar user
           const user = await User.create(req.body)
           user.password = undefined;
           return res.send(user);

           return;
           
       } catch (error) {
           res.status(400).send('error: Registration Failed.')
       }
    }
}