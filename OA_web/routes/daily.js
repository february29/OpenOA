var express = require('express');
var router = express.Router();
const Daily = require('../models/daily');




router.post('/approvalDaily',  function(req, res, next){



    var par = req.method == 'GET'?req.query:req.body;

    //type 1转报 2最终审核
    if (!par.daily_id ||!par.type || par.daily_id < 1 ||par.type < 1 ||par.type > 2 ){
        return  res.json({
            code: '-1',
            msg:'参数异常',

         })

    }

    var dailyUpdatePar = {};
    if (par.type == 1  ){
            //转报
        if (!par.next_id || par.next_id < 1 ){
              return   res.json({
                    code: '-1',
                    msg:'请选择转报人员',

                 })
        }
        dailyUpdatePar = {state:1,next_id:par.next_id };





    }else{
            //最终审批
        dailyUpdatePar = {state:2 };

    }

    Daily.approvalDaily(par.daily_id,
        dailyUpdatePar,
        {
            add_time :this.add_time,
            daily_id : this.daily_id,
            info : this.info,
            commit_id : this.commit_id,
            next_id : this.next_id,
            score : this.score,
        },
        function (err,result) {
            if (result){
                res.json({
                    code: '0',
                    msg:'操作成功',
                    data:result,
                })
            }else{
                res.json({
                    code: '-2',
                    msg:'操作失败',
                    data:result,
                })
            }
        })




});

router.post('/dailyAdd',  function(req, res, next){



    var par = req.method == 'GET'?req.query:req.body;



    if (!par.work_date){
       return  res.json({
            code: '-1',
            msg:'请添加工作日期',

        })
    }
    if (!par.low_id || par.low_id < 1){
        return res.json({
            code: '-1',
            msg:'请选择审批人',

        })
    }

    if (!par.content || !par.plane ){
        return res.json({
            code: '-1',
            msg:'请完善日报内容',

        })

    }


    var timestamp = (new Date()).valueOf();//获取当前毫秒的时间戳，准确！
    let daily = new Daily( {
            add_time:timestamp ,
            work_date:par.work_date ,
            content:par.content ,
            plane:par.plane ,
            low_id:par.low_id ,
            commit_id:par.commit_id,

            state:0,


    })


    daily.save(function (error,result) {
        console.log(error);
        if (result){
            res.json({
                code: '0',
                msg:'操作成功',
                data:result,
            })
        }else{
            res.json({
                code: '-2',
                msg:'操作失败',

            })
        }

    })








});

module.exports = router;