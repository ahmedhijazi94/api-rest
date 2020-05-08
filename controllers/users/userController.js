const User = require('../../models').User;


module.exports = {
    async register(req, res){
       const {login, email} = req.body;
       try {
           if(await User.findOne({where: {login : login}})){
               return res.status(400).send('User already exists.');
           }
           if(await User.findOne({where: {email: email}})){
                return res.status(400).send('E-mail already exists.');
           }
           await User.create(req.body).then(user => res.send(user));
           return;
           
       } catch (error) {
           res.status(400).send('error: Registration Failed.')
       }
    }
}