const User = require('../models/').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authConfig = require('./auth.json');


module.exports = {
    async authenticate(req, res){
        const {login, password} = req.body;
        
        const user = await User.findOne({where: {login : login}});
        if(!user){
            return res.status(400).send('error: User not found');
        }

        if(! await bcrypt.compare(password, user.password)){
            return res.status(400).send('error: Invalid password');
        }

        user.password = undefined;

        const token = jwt.sign({id: user.id}, authConfig.secret, {
            expiresIn: 86508
        });

        res.send({user, token})
    }
}