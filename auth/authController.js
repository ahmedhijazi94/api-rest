const User = require('../models/').User;
const bcrypt = require('bcrypt');

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

        res.send('ok')
    }
}