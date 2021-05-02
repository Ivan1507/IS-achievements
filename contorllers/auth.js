const bodyParser=require('body-parser')
const mysql=require('mysql2')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
require('dotenv').config()

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "spr",
    password: "кщще"
});


exports.login=(req,res)=>{
    try{
        const {login,password}=req.body

        if(!login||!password){
            res.status(400).render('login',{
                message:"Login or password is empty!"
            })
            return
        }

        connection.query('Select * from user where login=?',[login],async (err,results)=>{
            console.log(results)
            if(results<1){
               res.status(401).render('login',{
                   message:"No such user!"
               })
           }
        else if(!(await bcrypt.compare(password,results[0].password ))){
                res.status(401).render('login',{
                    message:"Wrong password!"
                })
            }
        else{
            const id=results[0].id

            const token=jwt.sign({id},process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRES_IN
            })


                const cookieoptions={
                expires:new Date(
                    Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60
                ),
                    httpOnly:true
                }

                res.cookie('jwt',token,cookieoptions)
                res.redirect('/')

            }
        })

    }
    catch (err){
        console.log(err)
    }
}


exports.register=(req,res)=>{
const {login,password}=req.body;
console.log(login)
connection.query('select login from spr.user where login=?',[login], async (err,result)=>{
    if(err){
        console.log(err)
    }
    if(result.length>0){
        return res.render('register',{
            message:'That email is already in use'
        })
    }
  let hashed=await bcrypt.hash(password,7)
    console.log(hashed)
    connection.query('Insert into user Set ?',{login:login,password:hashed},(err,result)=>{
        if(!err){
            res.render('index',{
                message:"You've been succesfully register!"
            })
        }
        else{
            console.log(err)
        }
    })
})
}