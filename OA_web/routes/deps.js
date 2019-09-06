var express = require('express');
var router = express.Router();
var db = require('../model/db');  //引入刚才自定义的模块


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
    var query = req.body;
    var query2 = req.query;
    console.log("post请求：参数", query);
    console.log("post请求：参数", query2);


    res.send('hello , world');
});

module.exports = router;
