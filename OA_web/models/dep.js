var db = require('./db');



let tableName = 'deps'
/**
 * 创建一个User对象，用于映射数据中的关系表
 * @param user
 * @constructor
 */


function Dep(dep) {
    this.id = dep.id;
    this.name = dep.name;
    this.p_id = dep.p_id;
    this.short_name = dep.short_name;



}

/**
 * 获取所有的部门列表信息
 * @param callback
 */
Dep.getAllDeps = function(callback){
    db.query('select * from '+ tableName, function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}


/**
 * 获取
 * @param depName
 * @param callback
 */
Dep.getDepByName = function (depName, callback) {
    db.query("select * from " + tableName + " where name = ?" , [depName], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}


/**
 * 根据depID编号获取用户详细信息
 * @param dep
 * @param callback
 */
Dep.getDepById = function (depId, callback) {
    db.query("select * from " + tableName + ` where id = ?`, [depId], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

Dep.deleteDepById = function(id, callback){
    db.query("delete from "+tableName+ "  where id = ?", [id], function (err, result) {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })
}

/**
 * 获取子部门列表
 * @param callback
 */
Dep.getDepsByPId = function(depPid ,callback){
    db.query("select * from " + tableName + ' where p_id = ?', [depPid],function (err, result) {
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
Dep.prototype.save = function (callback) {

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
module.exports = Dep;