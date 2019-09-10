var db = require('./db');



let tableName = 'dailys'
/**
 * 创建一个User对象，用于映射数据中的关系表
 * @param user
 * @constructor
 */


function Daily(daily) {
    this.id = daily.id;
    this.add_time = daily.add_time;
    this.work_date = daily.work_date;
    this.content = daily.content;
    this.plane = daily.plane;
    this.low_id = daily.low_id;
    this.commit_id = daily.commit_id;
    this.score = daily.score;
    this.evaluation = daily.evaluation;




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

/**
 * 函数的原型方法（使用之前需要先new 一个实例对象， 然后就可以在线面直接使用this 这个属性了，  原型方法是子类实例都可以循环调用的）
 * @param callback
 */
Daily.prototype.save = function (callback) {

    db.query('INSERT ignore INTO  ' +tableName + "SET ?"
        , {
            name:this.name,
            short_name:this.short_name,
            p_id:this.p_id,


        }
        , function (err, result) {
            if (err) {
                return callback(err, null);
            }

            // 返回插入数据的ID编号
            callback(null, result);
        });

}


//=============================================流程相关=====================================================


let tableName2 = 'daily_flows'

Daily.getFlowsByDailyId = function(dailyId){
    db.query("select * from " + tableName2 + ` where daily_id = ?`, [dailyId], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
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