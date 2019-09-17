var db = require('./db');



let tableName = 'dailys'



function Daily(daily) {
    this.id = daily.id;
    this.add_time = daily.add_time;
    this.work_date = daily.work_date;
    this.content = daily.content;
    this.plane = daily.plane;
    this.commit_id = daily.commit_id;
    this.low_id = daily.low_id;
    this.next_id = daily.next_id;
    this.state = daily.state;




}

/**
 * 获取所有的部门列表信息
 * @param callback
 */
Daily.getAllDaily = function(callback){
    db.query('select * from '+ tableName, function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

Daily.getDailysByUserID = function(userId,callback){
    db.query('select * from '+ tableName + 'where commit_id = ?', [userId],function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

Daily.getDailysByLowID = function(lowId,callback){
    db.query('select * from '+ tableName + 'where low_id = ?', [userId],function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}


/**
 * 根据depID编号获取用户详细信息
 * @param dep
 * @param callback
 */
Daily.geDailyById = function (dailyId, callback) {



    db.query("select * from " + tableName + ` where id = ?`, [dailyId], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

Daily.updateById = function ( dailyId,updatePar, callback) {



    db.query("update  " + tableName + ` set ? where id = ?` , [updatePar,dailyId], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

/**
 * 函数的原型方法（使用之前需要先new 一个实例对象， 然后就可以在线面直接使用this 这个属性了，  原型方法是子类实例都可以循环调用的）
 * @param callback
 */
Daily.prototype.save = function (callback) {

    db.query('INSERT ignore INTO  ' +tableName + " SET ?"
        , {
            add_time:this.add_time ,
            work_date:this.work_date ,
            content:this.content ,
            plane:this.plane ,
            low_id:this.low_id ,
            next_id:this.low_id ,
            commit_id:this.commit_id,
            state:0,
        }
        , function (err, result) {
            if (err) {
                 callback(err, null);

            }else{
                callback(null, result);
            }



        });

}


//=============================================流程相关=====================================================



// =============================================事务=========================================================
/**
 * 审批日报 添加审批流程，修改日报状态
 * @param dailyId  日报id
 * @param dailyUpdatePar  日报状态参数 转报是需要额外传递next_id
 * @param newDailyFlow 新的流程参数
 * @param callBack 回调
 */
Daily.approvalDaily = function(dailyId,dailyUpdatePar,newDailyFlow,callBack){


    let sqlparams1 = {
        sql:"update  " + tableName + ` set ? where id = ?`,
        parameter:[dailyUpdatePar,dailyId]
    }
    let sqlparams2 = {
        sql:"insert  into" + tableName2 + ` set ?`,
        parameter:newDailyFlow
    }

    let  sqlparamsEntities = [sqlparams1,sqlparams2];
   db.executeTransaction(sqlparamsEntities,function (err,result) {

       callBack(err,result);
   })

}


// /**
//  * 修改用户信息
//  * @param callback
//  */
// Dep.prototype.update = function (callback) {
//     //console.log('数据库中信息--------------------------', this)
//     db.query('update users set  password = ?, e_mail = ?, phone = ?, info = ?, photo = ? where id = ?', [
//             this.password, this.e_mail, this.phone, this.info, this.phone, this.id]
//         , function (err, result) {
//             if (err) {
//                 return callback(err, null);
//             }
//             callback(null, result);
//         })
// }
//
//
// /**
//  * update user info
//  * @param callback
//  */
// User.prototype.updateinfo = function(callback){
//     db.query('update users set e_mail = ?, phone = ?, info = ? where id = ?', [
//         this.email, this.phone, this.info, this.id
//     ], function (err, result) {
//         if (err) {
//             return callback(err, null);
//         }
//         callback(null, result);
//     });
// }


// 把当前的对象暴露出去
module.exports = Daily;