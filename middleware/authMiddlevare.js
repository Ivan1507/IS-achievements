const jwt=require('jsonwebtoken')
require('dotenv').config()

module.exports=(req,res,next)=>{


    if(req.method==="OPTIONS"){
        next()
    }

    try{
        let token="";
        if(req.headers.cookie) {
            const tok=req.headers.cookie.split(';')[0]
            //console.log(tok)
            token = tok.split('=')[1]
        }
        if(!token){
            res.status(400).render('login',{
                message:"Пользователь не авторизован\n"
            })
            return
        }
      // console.log(token.split('; ')[1])
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
        }
        catch (e){
            res.status(401).send("Чето не то с токеном!)")
        }
        next()

    }catch (e){
        console.log(e)
    }
}