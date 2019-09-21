var express = require('express');
var router = express.Router();
const Dep = require('../models/dep');

router.get('/getDepsByPId',  function(req, res, next){

    var par = req.method == 'GET'?req.query:req.body;

    if (!par.p_id){
        res.json({
            code: '-1',
            msg:'参数异常',

        })

    } else if (par.p_id == 0){
        Dep.getAllDeps(function (error,result) {
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })

        })
    }else{
        Dep.getDepsByPId(par.p_id,function (error,result) {
            if (result){
                res.json({
                    code: '0',
                    msg:'请求成功',
                    data:result,
                })
            }else{
                res.json({
                    code: '-2',
                    msg:'请求失败',

                })
            }

        })
    }

});
router.get('/getDepById',function(req, res, next){
    var par = req.method == 'GET'?req.query:req.body;

    if (!par.id){
        res.json({
            code: '-1',
            msg:'参数异常',

        })

    }else{
        Dep.getDepById(par.id,function (error,result) {
            if (result){
                res.json({
                    code: '0',
                    msg:'请求成功',
                    data:result,
                })
            }else{
                res.json({
                    code: '-2',
                    msg:'请求失败',

                })
            }

        })
    }
});


router.get('/getAllDep',function(req, res, next){
    var par = req.method == 'GET'?req.query:req.body;

    Dep.getAllDeps(function (error,result) {
        if (result){
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })
        }else{
            res.json({
                code: '-2',
                msg:'请求失败',

            })
        }

    })
});



router.post('/addDep', function(req, res, next) {

    // 获取参数
    // var query = req.body;
    // console.log("post请求：参数 body", query);
    var par = req.method == 'GET'?req.query:req.body;

    if (!par.name||!par.p_id){
        res.json({
            code: '-1',
            msg:'参数异常',

        })
    }else{


        new Dep({
                name:par.name,
                short_name:par.short_name,
                p_id:par.p_id,
             }).save(function (err,result) {
                 if (err){
                     console.log("====="+err)
                     res.json({
                         code: '-2',
                         msg:'操作失败',
                     })
                 }else{
                     res.json({
                         code: '0',
                         msg:'操作成功',
                         data:result,
                     })
                 }

        })
        // db.insert( db.connection(),'INSERT ignore INTO deps SET ?',
        //     {
        //         name:par.name,
        //         short_name:par.short_name,
        //         p_id:"0"
        //     },
        //     function (result) {
        //
        //         if (result){
        //             res.json({
        //                 code: '0',
        //                 msg:'操作成功',
        //                 data:result,
        //             })
        //         }else{
        //             res.json({
        //                 code: '-2',
        //                 msg:'操作失败',
        //
        //             })
        //         }
        //
        //
        //
        //
        //     })
    }






});

module.exports = router;
