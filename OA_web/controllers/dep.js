const Dep = require('../models/dep');


/**
 * 通过部门Id获取用户列表
 * @param req
 * @param res
 * @param next
 */
exports.getDepById = function (req, res, next) {
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

}


exports.getDepsByPId  = function (req, res, next) {
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

}
