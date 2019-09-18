var express = require('express');
var router = express.Router();
const Daily = require('../models/daily');
const Daily_flows = require('../models/daily_flow');


//日报详情 包含审批列表
router.get('/getDailyDetail',function (req,res,next) {
    //参数检查
    var par = req.method == 'GET'?req.query:req.body;
    if (!par.daily_id){
        return  res.json({
            code: '-1',
            msg:'参数异常',

        })
    }

    Daily.geDailyById(par.daily_id,function (err,result) {
        if (!result){
            return  res.json({
                code: '-1',
                msg:'未找到该日报',

            })
        }

        Daily_flows.getFlowsByDailyId(par.daily_id,function (err2,flowsResult) {
            return  res.json({
                code: '0',
                msg:'请求成功',
                daily:result,
                daily_flows:flowsResult


            })
        })
    })
});

/**
 * 审批日报
 */
router.post('/approvalDaily',  function(req, res, next){



    //参数检查
    var par = req.method == 'GET'?req.query:req.body;

    //type 1转报 2最终审核
    if (!par.daily_id ||!par.type || par.daily_id < 1 ||par.type < 1 ||par.type > 2 ){
        return  res.json({
            code: '-1',
            msg:'参数异常',

         })

    }

    var dPar ;
    if (par.type == 1  ){
            //转报
        if (!par.next_id || par.next_id < 1 ){
              return   res.json({
                    code: '-1',
                    msg:'请选择转报人员',

                 })
        }
        dPar = {state:1,next_id:par.next_id };





    }else{
            //最终审批
        dPar = {state:2 };

    }

    Daily.geDailyById(par.daily_id,function (err,result) {

       if (!result){
            return  res.json({
               code: '-1',
               msg:'未找到该日报',

           })
       }
       if (result.state == 2 ){
           return  res.json({
               code: '-1',
               msg:'该日报已审批完成',

           })
       }
       if (result.next_id != par.commit_id){
           return  res.json({
               code: '-1',
               msg:'无权限操作',

           })
       }


        Daily.approvalDaily(par.daily_id,
            dPar,
            {
                add_time :new Date().valueOf(),
                daily_id : par.daily_id,
                info : par.info,
                commit_id : par.commit_id,
                next_id : par.next_id,
                score : par.score,
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