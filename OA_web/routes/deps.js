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
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })

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
            res.json({
                code: '0',
                msg:'请求成功',
                data:result,
            })

        })
    }
});



router.post('/addDep', function(req, res, next) {

    // 获取参数
    // var query = req.body;
    // console.log("post请求：参数 body", query);
    var par = req.query;
    console.log("post请求：参数 query", par);
    if (!par.name){
        res.json({
            code: '1',
            msg:'参数异常',

        })
    }else{
        db.insert( db.connection(),'INSERT ignore INTO deps SET ?',
            {
                name:par.name,
                short_name:par.short_name,
                p_id:"0"
            },
            function (result) {

                res.json({
                    code: '0',
                    msg:'操作成功',
                    dep:result
                });




            })
    }






});

module.exports = router;
