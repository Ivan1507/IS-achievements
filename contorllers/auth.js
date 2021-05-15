const bodyParser=require('body-parser')
const mysql=require('mysql2')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
require('dotenv').config()
const config=require('../config/db.config')

const connection = mysql.createConnection(config);


exports.login=(req,res)=>{
    try{
        const {login,password}=req.body

        if(!login||!password){
            res.status(400).render('login',{
                message:"Пароль или логин пустой!",
                isLogout:true
            })
            return
        }

        connection.query('Select * from user where login=?',[login],async (err,results)=>{
            console.log(results)
            if(results<1){
               res.status(401).render('login',{
                   message:"Пользователь с таким логином отсутствует!",
                   isLogout:true
               })
           }
        else if(!(await bcrypt.compare(password,results[0].password ))){
                res.status(401).render('login',{
                    message:"Неправильно набран пароль!",
                    isLogout:true
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
if(login.length<5||password.length<5){
    res.render('register',{
        error:"Логин и пароль должны быть длинее 4 символов!"
    })
    return
}
connection.query('select login from spr.user where login=?',[login], async (err,result)=>{
    if(err){
        console.log(err)
    }
    if(result.length>0){
        return res.render('register',{
            message:'Такой логин уже используется, попробуйте другой!'
        })
    }
  let hashed=await bcrypt.hash(password,7)
    console.log(hashed)
    connection.query('Insert into user Set ?',{login:login,password:hashed},(err,result)=>{
        if(!err){
            res.render('index',{
                message:"Вы успешно зарегистрированы!"
            })
        }
        else{
            console.log(err)
        }
    })
})
}