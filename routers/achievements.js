const {Router}=require('express')
const mysql=require('mysql2')
const {body, validationResult } = require('express-validator');
const router=Router()
const config=require('../config/db.config')

const connection = mysql.createConnection(config);
router.get('/',(req,res)=>{
    connection.query("SELECT * FROM achievement where checked=1",
        function(err, results, fields) {
            res.render('achievements',{
                Achievements:results
            })
        });
})
router.get('/edit/:id',(req,res)=>{
    const id=req.params.id
    connection.query('Select * From achievement where achiv_id=?', [id], function (err, data) {
        if(data[0]!==undefined) {
            res.render('achievement', {
                Achievement: data[0]
            })
        }
        else {
            console.log(data[0])
            res.status(401).send('Такое достижение отсутствует')
        }

    })
})

router.get('/add',(req,res)=>{
    res.render('add_achievement',{
        title:"Добавление достижения"
    })
})

router.post('/add',[
    body('name').isLength({min:6}).withMessage("Название достижения должно быть больше 6 и меньше 45 символов!"),
    body('date').isDate().withMessage('Неверно введена дата!'),
    body('description').isLength({min:10,max:200}).withMessage("Минимальная длина описания 10 символов!"),
    body('type').isLength({min:3}).withMessage("Слишком короткий тип достижения!")
],(req,res)=>{
    const {name,date,type,description}=req.body
    const checked=0
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.render('add_achievement',{
            errs:errors.array(),
            title:"Добавление достижения"
        })
    }
    else {
        connection.query('Insert into achievement  (name,date,type,description,checked) Values(?,?,?,?,?)',[name,date,type,description,checked],(err,result)=>{

            if(!err){
                res.redirect('/achievements')
            }
            else{
                console.log(err)
            }

        })
    }
})



router.post('/delete/:id',(req,res)=>{
    const id=req.params.id
    connection.query('Delete from achievement where achiv_id=?',[id],(err,results)=>{
        if(!err){
            res.redirect('/achievements')
        }
    })
})

router.post('/edit/:id',[
    body('name').isLength({min:6}).withMessage("Название достижения должно быть больше 6 и меньше 45 символов!"),
    body('date').isDate().withMessage('Неверно введена дата!'),
    body('description').isLength({min:10,max:200}).withMessage("Минимальная длина описания 10 символов!"),
    body('type').isLength({min:3}).withMessage("Слишком короткий тип достижения!")
], (req,res)=>{
        const {id, name, date,type, description} = req.body
        const errors=validationResult(req)
        if(!errors.isEmpty()) {
            connection.query("Select * from achievement where achiv_id=?",[id],(err,results)=>{
                if(!err)
                res.render('achievement',{
                    Achievement:results[0],
                    errs:errors.array()
                })
            })

        }
        else {
            connection.query('update achievement set Name=?,date=?,type=?,description=? where achiv_id=?', [name, date,type, description, id], function (err, data) {
                if (!err)
                    res.redirect('/')
            })
        }

})
module.exports=router