const {Router}=require('express')
const mysql=require('mysql2')
const router=Router()
const path=require('path')
const config=require('../config/db.config')

const connection = mysql.createConnection(config);

router.get('/',(req,res)=>{
    connection.query('Select * from achievement where checked=1',(err,data)=>{
        res.render('news1',{
            Achievements:data,
            title:"Новости института Спинтех",
            isLogout:true
    })
    })
})


router.get('/:id',(req,res)=>{
    const id=req.params.id
    connection.query('Select * from achievement where achiv_id=?',[id],(err,achiv)=>{
        connection.query('SELECT participate.achiv_id,participant.* from\n' +
            ' participate,participant\n' +
            'where participate.part_id=participant.part_id and participate.achiv_id=?\n',[id],(err,partics)=>{
            res.render('about',{
                Achievement:achiv[0],
                Participants:partics,
                isLogout:true
            })
        })
    })
})

module.exports=router