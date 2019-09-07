var express = require('express');
var router = express.Router();
var db = require('../models/db');





//通过id获取用户详情
router.get('/getUserById', function(req, res, next) {

  var query  = res.query;
  if (!query.id){
    res.json({
      code: '1',
      msg:'参数异常',

    })
  }else{

    var con = db.connection();
    db.query(con,'select * from user.js where id = ?',[query.id],function (error,results,fields) {
      var user = results;
      res.json({
        code: '0',
        msg:'请求成功',
        user:user
      });
    })


  }

});

router.get('/login', function(req, res, next) {

  console.log(req.method);//get
  var query  = req.query;
  console.log("login：参数 res", req.body);
  console.log("login：参数 query", query);
  if (!query.username||!query.password){
    res.json({
      code: '1',
      msg:'参数异常',

    })

  }else{
    var con = db.connection();
    db.query(con,'select * from user.js where username = ? and password = ?',[query.username,query.password],function (error,results,fields) {
      var user = results;
      res.json({
        code: '0',
        msg:'请求成功',
        user:user
      });
    })

  }
});

router.post('/addUser', function(req, res, next) {

  // 获取参数
  // 获取参数
   var par = req.body;
   console.log("post请求：参数 body", par);
   var par2 = req.query;
  console.log("post请求：参数 query", par2);
  if (!par.name||!par.username||!par.password){
    res.json({
      code: '1',
      msg:'参数异常',

    })
  }else{
    db.insert( db.connection(),'INSERT ignore INTO user.js SET ?',
        {
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
