const {Router}=require('express')
const mysql=require('mysql2')
const {body, validationResult } = require('express-validator');
const router=Router()
const config=require('../config/db.config')

const connection = mysql.createConnection(config);

router.get('',(req,res)=>{
    connection.query('Select * from participant',(err,data)=>{
        console.log(data)
        res.render('participants',{
            Participants:data,
            title:"Список участников"
        })
    })
})
router.get('/edit/:id',(req,res)=>{
    const id=req.params.id;
    connection.query('Select * from participant where part_id=?',[id],(err,data)=>{
        if(!err){
            res.render('participant',{
                Participant:data[0],
                title:"Редактирование участника"
            })
        }
    })
})
router.post('/edit/:id',[
    body('FIO').isLength({min:6}).withMessage("Минимальная длина ФИО 6 символов!"),
    body('position').isLength({min:6}).withMessage("Минимальная длина должности 6 символов!"),
],(req,res)=>{
    const {id, FIO, position,link} = req.body
    const errors=validationResult(req)
    if(!errors.isEmpty()) {
        connection.query("Select * from participant where part_id=?", [id], (err, results) => {
            res.render('participant', {
                    Participant: results[0],
                    errs: errors.array(),
                    title: "Редактирование участника"
                })
        })
    }
    else{
        connection.query('Update participant set FIO=?,position=?,link=? where part_id=?',[FIO,position,link,id],(err,data)=>{
            res.redirect('/participants')
        })
    }
})

router.get('/add',(req,res)=>{
    res.render('add_participant',{
        title:"Добавление участника"
    })
})

router.post('/add',[
    body('FIO').isLength({min:6}).withMessage("Минимальная длина ФИО 6 символов!"),
    body('position').isLength({min:6}).withMessage("Минимальная длина должности 6 символов!"),
],(req,res)=>{
    const {FIO,position,link}=req.body
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.render('add_participant',{
            errs:errors.array(),
            title:"Добавление участника"
        })
    }
    else{
        connection.query('Insert into participant (FIO,Position,link) Values(?,?,?)',[FIO,position,link],(err,data)=>{})
        res.redirect('/participants')
    }
})

router.post('/delete/:id',(req,res)=>{
    const id=req.params.id
    connection.query('Delete from participant where part_id=?',[id],(err,data)=>{
        res.redirect('/participants')
    })

})



module.exports=router