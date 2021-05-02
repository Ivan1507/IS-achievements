const {Router}=require('express')
const mysql=require('mysql2')
const auth=require('./contorllers/auth')
const bodyParser=require('body-parser')
const router=Router()
const authMiddle=require('./middleware/authMiddlevare')

const urlencodedParser = bodyParser.urlencoded({extended: false});
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "spr",
    password: "кщще"
});
router.get('/achivments',authMiddle,(req,res)=>{
    connection.query("SELECT * FROM achivment where checked=1",
        function(err, results, fields) {
            res.render('achivments',{
                Achivs:results
            })
        });
})
router.get('/achivments/:id',authMiddle,(req,res)=>{
    const id=req.params.id
        connection.query('Select * From achivment where achiv_id=?', [id], function (err, data) {
            res.render('person', {
                Person: data[0]
            })
            console.log(data[0])
        })
})

router.get('/auth/logout',(req,res)=>{
    res.cookie('jwt','')
    res.redirect('/')
})


router.get('/auth/register',(req,res)=>{
    res.render('register')
})
router.get('/auth/login',(req,res)=>{
    res.render('login')
})
router.get('/',(req,res)=>{
    res.render('index')
})
router.post('/auth/register',urlencodedParser,auth.register)

router.post('/auth/login',urlencodedParser,auth.login)


router.post('/persons/:id',urlencodedParser,(req,res)=>{
    const {name,surname,id}=req.body
    connection.query('update Person set Name=?,Surname=? where idPerson=?',[name,surname,id],function (err,data){
        if(!err)
            res.redirect('/')
    })

})
module.exports=router