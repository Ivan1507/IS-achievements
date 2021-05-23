const jwt=require('jsonwebtoken')
require('dotenv').config()

module.exports=function (roles){
    return function (req,res,next){
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

            const {roles:userRoles}=jwt.verify(token, process.env.JWT_SECRET)
            let hasRole=false
            roles.forEach(role=>{
                if(roles.includes(userRoles)){
                    hasRole=true;
                }
            })
            if(!hasRole){
                return res.status(400).render('login',{
                    message:"У вас недостаточно прав\n"
                })
            }

            next()

        }catch (e){
            return res.render('login',{
                message:"Пользователь не авторизован"
            })
        }
    }
}