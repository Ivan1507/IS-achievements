const jwt=require('jsonwebtoken')
require('dotenv').config()

module.exports=(req,res,next)=>{


    if(req.method==="OPTIONS"){
        next()
    }

    try{
        let token="";
        if(req.headers.cookie)
            token=req.headers.cookie.split('=')[1]
        if(!token){
            res.status(400).render('login',{
                message:"User not authorized\n"
            })
            return
        }


        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        req.user=decoded
        next()

    }catch (e){
        console.log(e)
    }
}