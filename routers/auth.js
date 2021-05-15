const {Router}=require('express')
const auth=require('../contorllers/auth')
const bodyParser=require('body-parser')
const router=Router()

const urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/register',(req,res)=>{
    res.render('register',{
        isLogout:true
    })
})
router.get('/login',(req,res)=>{
    res.render('login',{
        isLogout:true
    })
})

router.get('/logout',(req,res)=>{
    res.cookie('jwt','')
    res.render('index',{
        isLogout:true
    })
})

router.post('/register',urlencodedParser,auth.register)

router.post('/login',urlencodedParser,auth.login,(req,res)=>{

})

module.exports=router