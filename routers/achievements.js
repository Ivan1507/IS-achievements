const {Router}=require('express')
const mysql=require('mysql2')
const {body, validationResult } = require('express-validator');
const router=Router()
const path=require('path')
const config=require('../config/db.config')
const isAuth=require('../middleware/authMiddlevare')
const roleMiddle=require('../middleware/roleMiddleawre')


const connection = mysql.createConnection(config);
router.get('',isAuth,(req,res)=>{
    connection.query("SELECT * FROM achievement where checked=1",
        function(err, results, fields) {
            res.render('achievements',{
                Achievements:results,
                title:"Список достижений"
            })
        });
})
router.get('/edit/:id',isAuth,(req,res)=>{
    const id=req.params.id
    connection.query('Select * From achievement where achiv_id=?', [id], function (err, data) {
        if(data[0]!==undefined) {
            res.render('achievement', {
                Achievement: data[0],
                title:"Редактирование достижения"
            })
        }
        else {
            console.log(data[0])
            res.status(401).send('Такое достижение отсутствует')
        }

    })
})

router.get('/add',isAuth,(req,res)=>{
    res.render('add_achievement',{
        title:"Добавление достижения"
    })
})

router.post('/add',isAuth,[
    body('name').isLength({min:6}).withMessage("Название достижения должно быть больше 6 и меньше 45 символов!"),
    body('date').isDate().withMessage('Неверно введена дата!'),
    body('description').isLength({min:10,max:200}).withMessage("Минимальная длина описания 10 символов!"),
    body('type').isLength({min:3}).withMessage("Слишком короткий тип достижения!"),
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
    else if(req.files){
        console.log(123)
        var sampleFile=req.files.certificate
        const uploadPath='upload/'+sampleFile.name
        console.log(sampleFile)
        if(sampleFile.mimetype==='image/jpeg'||sampleFile.mimetype==='image/jpg'||sampleFile.mimetype==='image/png') {
            sampleFile.mv(uploadPath, function (err) {
                if (err)
                    return res.send(err)
                connection.query('Insert into achievement (name,date,type,description,checked,certificate)  Values(?,?,?,?,?,?)', [name, date,type, description,checked,sampleFile.name], function (err, data) {
                    if (!err)
                        res.redirect('/achievements')
                })

            })
        }
        else{
            const message="Недопустимый формат, загрузите файл с расширением '.png','.jpeg','.jpg'";
            connection.query('Select * from achievement where achiv_id=?',[id],(err,data)=>{
                res.render('achievement',{
                    errk:message,
                    Achievement:data[0],
                    title:"Редактирование достижения"
                })
            })

        }

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

router.post('/edit/:id',isAuth,[
    body('name').isLength({min:6}).withMessage("Название достижения должно быть больше 6 и меньше 45 символов!"),
    body('date').isDate().withMessage('Неверно введена дата!'),
    body('description').isLength({min:10,max:200}).withMessage("Минимальная длина описания 10 символов!"),
    body('type').isLength({min:3}).withMessage("Слишком короткий тип достижения!"),
], (req,res)=>{
        const {id, name, date,type, description,checked} = req.body
    console.log(checked)
        const errors=validationResult(req)
        if(!errors.isEmpty()) {
            connection.query("Select * from achievement where achiv_id=?",[id],(err,results)=>{
                if(!err)
                res.render('achievement',{
                    Achievement:results[0],
                    errs:errors.array(),
                    title:"Редактирование достижения"
                })
            })

        }
        else if(req.files){
            var sampleFile=req.files.certificate
          const uploadPath='upload/'+sampleFile.name
            console.log(sampleFile)
            if(sampleFile.mimetype==='image/jpeg'||sampleFile.mimetype==='image/jpg'||sampleFile.mimetype==='image/png') {
                sampleFile.mv(uploadPath, function (err) {
                    if (err)
                        return res.send(err)
                    connection.query('update achievement set Name=?,date=?,type=?,description=?,certificate=? where achiv_id=?', [name, date,type, description,sampleFile.name, id], function (err, data) {
                        if (!err)
                            res.redirect('/achievements')
                    })

                })
            }
        else{
            const message="Недопустимый формат, загрузите файл с расширением '.png','.jpeg','.jpg'";
            connection.query('Select * from achievement where achiv_id=?',[id],(err,data)=>{
                res.render('achievement',{
                    errk:message,
                    Achievement:data[0],
                    title:"Редактирование достижения"
                })
            })

            }

        }
        else{
            connection.query('update achievement set Name=?,date=?,type=?,description=? where achiv_id=?', [name, date,type, description, id], function (err, data) {
                if (!err)
                    res.redirect('/achievements')
            })
        }

})

router.get('/check',roleMiddle(['admin']),(req,res)=>{
    connection.query('Select * From achievement', function (err, data) {
            res.render('achievements_check', {
                Achievements: data,
                title:"Утверждение достижений",
            })
    })
})

router.get('/check/:id',roleMiddle(['admin']),(req,res)=>{
    const id=req.params.id
    connection.query('Select * from achievement where achiv_id=?',[id],(err,data)=>{
        if(data[0]!==undefined) {
            res.render('achievement_check', {
                Achievement: data[0],
                title:"Утверждение достижения"
            })
        }
        else {
            console.log(data[0])
            res.status(401).send('Такое достижение отсутствует')
        }
    })
})
router.post('/check/:id', roleMiddle(['admin']),[
    body('name').isLength({min:6}).withMessage("Название достижения должно быть больше 6 и меньше 45 символов!"),
    body('date').isDate().withMessage('Неверно введена дата!'),
    body('description').isLength({min:10,max:200}).withMessage("Минимальная длина описания 10 символов!"),
    body('type').isLength({min:3}).withMessage("Слишком короткий тип достижения!"),
    body('checked').isLength({min:1}).withMessage("Определите статус достижения (0/1)!")
],
   (req,res)=>{
    const {id, name, date,type, description,checked} = req.body
    const errors=validationResult(req)
    if(!errors.isEmpty()) {
        connection.query("Select * from achievement where achiv_id=?",[id],(err,results)=>{
            if(!err)
                res.render('achievement_check',{
                    Achievement:results[0],
                    errs:errors.array(),
                    title:"Утверждение достижения"
                })
        })

    }
    else if(req.files){
        var sampleFile=req.files.certificate
        const uploadPath='upload/'+sampleFile.name
        console.log(sampleFile)
        if(sampleFile.mimetype==='image/jpeg'||sampleFile.mimetype==='image/jpg'||sampleFile.mimetype==='image/png') {
            sampleFile.mv(uploadPath, function (err) {
                if (err)
                    return res.send(err)
                connection.query('update achievement set Name=?,date=?,type=?,description=?,certificate=?,checked=? where achiv_id=?', [name, date,type, description,sampleFile.name,checked, id], function (err, data) {
                    if (!err)
                        res.redirect('/achievements/check')
                })

            })
        }
        else{
            const message="Недопустимый формат, загрузите файл с расширением '.png','.jpeg','.jpg'";
            connection.query('Select * from achievement where achiv_id=?',[id],(err,data)=>{
                res.render('achievement_check',{
                    errk:message,
                    Achievement:data[0],
                    title:"Утверждение достижения"
                })
            })

        }

    }
    else{
        connection.query('update achievement set Name=?,date=?,type=?,description=?,checked=? where achiv_id=?', [name, date,type, description,checked, id], function (err, data) {
            if (!err)
                res.redirect('/achievements/check')
        })
    }
})

module.exports=router