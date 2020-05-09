const jwt = require('jsonwebtoken');
const authConfig = require('./auth.json');

module.exports = (req, res, next) =>{
    const authHeaders = req.headers.authorization;
    //se nao tiver headers de autorização retorna erro.
    if(!authHeaders){
       return res.status(401).send('Erro: No token provided.')
    }
    //separar o header autorização entre 2 partes.
    const parts = authHeaders.split(' ');
    //verifica se há 2 partes (Bearer e token) se não, retorna erro.
    if(!parts.length === 2){
        return res.status(401).send('Error: Token error');
    }
    //armazenar as 2 partes do header em 2 variaveis.
    const [scheme, token] = parts;
    //checa se a primeira parte é = Bearer, se não, retorna erro.
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send('Error: Token malformatted');
    }
    //verificar se o token é valido
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err){
            return res.status(401).send('Error: Invalid Token');
        }
        // se for válido, retorna o userId e liberar o usuario a acessar o resto da api.
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin;
        return next();

    });   
};