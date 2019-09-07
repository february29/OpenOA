var express = require('express');
var router = express.Router();
var db = require('../models/db');  //引入刚才自定义的模块


//通过id获取用户详情
router.get('/getDepById', function(req, res, next) {

    var query  = res.query;
    if (query.id){

        var con = db.connection();
        db.query(con,'select * from deps where id = ?',[query.id],function (error,results,fields) {
            var user = results;
            res.json({
                code: '0',
                msg:'请求成功',
                user:user
            });
        })



    }else{
        res.json({
            code: '1',
            msg:'参数异常',

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
