//chama adminMiddleware com parametro se precisa de admin
const adminMiddleware = (needAdmin) => {
    return  function middleware(req, res, next){
        //se precisar de admin
        if(needAdmin){
            //pega isAdmin do token
            const isAdmin = req.isAdmin;
            if(!isAdmin){
                return res.status(401).send('Erro: Unauthorized');
            }
            return next();
        }
        return next();
    }
}
module.exports = adminMiddleware;


