const express=require('express')
const achiv=require('./routers/achievements')
const auth=require('./routers/auth')
const participate=require('./routers/participate')
const participant=require('./routers/participants')
const news=require('./routers/news')
const path=require('path')
const report=require('./routers/reports')
const authMiddle=require('./middleware/authMiddlevare')
const body=require('body-parser')
const exhbs=require('express-handlebars')
const cookieParser=require('cookie-parser')
const uploadFiles=require('express-fileupload')


const PORT=3000

const app=express()
app.use(uploadFiles())

app.use(express.static('public'))
app.use(express.static('scripts'))
app.use(express.static('upload'))
app.engine('hbs',exhbs({extname:'.hbs'}))



app.use(cookieParser())
app.set('view engine','hbs')
app.set('views','views')
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
app.use('/participate',authMiddle,participate)
app.use('/news',news)
app.use('/achievements',achiv)
app.use('/reports',authMiddle,report)
app.use('/participants',authMiddle,participant)
app.use('/auth',auth)
app.get('',(req,res)=>{
    res.render('index',{
        title:"Это страница учёта достижения"
    })
})

app.listen(PORT,()=>{
    console.log('Server')
})
