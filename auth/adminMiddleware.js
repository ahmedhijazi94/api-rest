const adminMiddleware = (needAdmin) => {
    return  function middleware(req, res, next){
        if(needAdmin){
            next();
        }
        res.send('not admin');
    }
}

module.exports = adminMiddleware;