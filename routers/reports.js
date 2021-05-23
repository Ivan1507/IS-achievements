const {Router}=require('express')
const mysql=require('mysql2')
const {body, validationResult } = require('express-validator');
const router=Router()
const config=require('../config/db.config')

const connection = mysql.createConnection(config);

router.get('',(req,res)=>{
    connection.query('SELECT FIO, Count(achiv_id) as \'C_ach\' from\n' +
        'participant,participate\n' +
        'where participant.part_id=participate.part_id\n' +
        'group by FIO',(err,data)=>{
        res.render('report', {
            Participants: data,
            title:"Достижения по участникам"
        })
    })
})

router.post('',[
    body('date').isDate().withMessage("Введите валидную дату!")
],(req,res)=>{
    const date=req.body.date
    console.log(date)
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        connection.query('SELECT FIO, Count(achiv_id) as \'C_ach\' from\n' +
            'participant,participate\n' +
            'where participant.part_id=participate.part_id\n' +
            'group by FIO',(err,data1)=>{
            res.render('report',{
                title:"Достижения по участникам",
                errs:errors.array(),
                Participants:data1,
            })
        })
    }
    else {
        connection.query('SELECT if(str_to_date(date,"%Y-%m-%d")>=str_to_date(?,\'%Y-%m-%d\'),date,"") as "date",count(part_id) as \'C_ach\' FROM spr.achievement,participate\n' +
            'where achievement.achiv_id=participate.achiv_id \n' +
            'group by date\n' +
            'order by date', [date], (err, data) => {
            connection.query('SELECT FIO, Count(achiv_id) as \'C_ach\' from\n' +
                'participant,participate\n' +
                'where participant.part_id=participate.part_id\n' +
                'group by FIO', (err, data1) => {
                res.render('report', {
                    title: "Достижения по участникам",
                    Achievements: data,
                    isDateEntered:true,
                    date:date,
                    Participants: data1,
                })
            })
        })
    }
})

module.exports=router