const express=require('express')
const mysql=require('mysql2')
const achiv=require('./routers/achievements')
const auth=require('./routers/auth')
const participate=require('./routers/participate')
const path=require('path')
const authMiddle=require('./middleware/authMiddlevare')
const body=require('body-parser')
const exhbs=require('express-handlebars')
const cookieParser=require('cookie-parser')

const PORT=3000

const app=express()

app.use(express.static('public'))
app.use(body.urlencoded({ extended: true }))
app.use('/achievements',authMiddle,achiv)
app.use('/auth',auth)
app.use('/participate',authMiddle,participate)

app.get('/',(req,res)=>{
    res.render('index')
})

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.engine('hbs',exhbs({extname:'.hbs'}))

app.use(express.static('scripts'))
app.set('view engine','hbs')
app.set('views','views')
app.listen(PORT,()=>{
    console.log('Server')
})

