const {Router}=require('express')
const mysql=require('mysql2')
const {body, validationResult } = require('express-validator');
const router=Router()
const config=require('../config/db.config')

const connection = mysql.createConnection(config);


router.get('/',(req,res)=>{
    connection.query(
        'SELECT * from achievement where achievement.checked=1',(err,data)=>{
        console.log(data)
      res.render('participate',{
          Achievements:data
      })
    })
})

router.post('/add/:id',(req,res)=>{
    const part_id=req.body.part_id
    const achiv_id=req.params.id
    console.log(achiv_id,part_id)
    connection.query('Insert into participate (part_id,achiv_id) Values(?,?)',[part_id,achiv_id],(err,data)=>{
        res.redirect('/participate')
    })
})
router.post('/delete/:id',(req,res)=>{
    const part_id=req.params.id
    const achiv_id=req.body._id
    console.log(achiv_id,part_id)
    connection.query('Delete from participate where achiv_id=? and part_id=?',[achiv_id,part_id],(err,data)=>{
        if(!err)
            res.redirect('/participate')
    })
})



router.get('/add/:id',(req,res)=>{
    const achiv_id=req.params.id
    //console.log(achiv_id)
    connection.query('SELECT achiv_id,participant.* FROM participant,participate ' +
        'where achiv_id=?',[achiv_id],(err,data)=>{
        console.log(data)
        res.render('add_to_participate',{
            Participants:data
        })
    })
})



router.get('/edit/:id',(req, res) => {
    const id=req.params.id
    connection.query('SELECT participate.achiv_id, participant.* from participant,participate ' +
        'where participant.part_id=participate.part_id and participate.achiv_id=?',[id],(err,data)=>{
     connection.query('select * from participant',(err,data1)=>{
         data1.achiv_id=id
         res.render('participate_info',{
             achiv_id:id,
             Achievements:data,
             Participants:data1
         })
     })

    })
})

module.exports=router