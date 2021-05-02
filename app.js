const express=require('express')
const mysql=require('mysql2')
const routers=require('./routes')
const path=require('path')
const body=require('body-parser')
const exhbs=require('express-handlebars')
const cookieParser=require('cookie-parser')


const PORT=3000

 const app=express()


app.use(express.static('public'))
app.use('/',routers)
const hbs=exhbs.create({
    defaultLayout: 'main',
    extname:'hbs'
})
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.engine('hbs',hbs.engine)
app.set('view engine','hbs')
app.set('views','views')
app.listen(PORT,()=>{
    console.log('Server')
})

