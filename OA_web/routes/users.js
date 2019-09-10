var express = require('express');
var router = express.Router();



const User = require('../models/user');


router.post('/doAddUser', function (req,res,next) {
    var par = req.body;
    console.log("post请求：参数 body", par);
    if (!par.name||!par.username||!par.password){
        res.json({
            code: '-1',
            msg:'参数异常',

        })
    }else{
        User.getUserByUsername(par.username,function (err, result) {
            if (!result){
                let  user = new User({
                    name:par.name,
                    phone:par.phone,
                    o_phone:par.o_phone,
                    e_mail:par.e_mail,
                    photo:par.photo,
                    post:par.post,
                    username:par.username,
                    password:par.password,
                    education:par.education,
                    join_time:par.join_time,
                    regular_time:par.regular_time,

                })
                user.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    // 插入成功的话就会得到结果
                    let uid = result.insertId;
                    if (uid === 0) {
                        // 插入失败
                        return res.json({
                            code: -3,
                            msg: '插入失败'
                        });
                    }else{
                        res.json({
                            code: 0,
                            msg: 'success'
                        });

                    }
                })

            }else{
                res.json({
                    code: '-2',
                    msg:'用户已经存在',

                })
            }
        })

    }
});

router.get('/getUsersByDepId', function (req,res,next) {
    var par = req.method == 'GET'?req.query:req.body;

    if (!par.dep_id){
        res.json({
            code: '-1',
            msg:'参数异常',

        })

    }else if(par.dep_id == 0){
        User.getAllUsers(function (error,result) {
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })
        })
    }else{
        User.getUserByDepId(par.dep_id,function (error,result) {
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })

        })
    }
});
router.get('/getUserById',  function (req,res,next) {
    var par = req.method == 'GET'?req.query:req.body;

    if (!par.id){
        res.json({
            code: '-1',
            msg:'参数异常',

        })

    }else{
        User.getUserById(par.id,function (error,result) {
            if (error){
                res.json({
                    code: '0',
                    msg:'请求失败',
                    data:result,
                })
            }
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })

        })
    }
});


module.exports = router;
