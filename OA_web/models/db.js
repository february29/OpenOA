//定义数据库query函数，向外暴露
// let mysql = require('mysql');
// let db = {}
//
// //插入操作，注意使用异步返回查询结果
// db.insert = function(connection, sql, paras, callback){
//
//     connection.query(sql, paras, function (error, results, fields) {
//         if (error) throw error;
//         callback(results);//返回插入的id
//         db.close(connection);
//     });
// }
//
// db.query = function(connection,sql,paras,callback){
//     connection.query(sql,paras,function (error,results,fields) {
//         if (error) throw error;
//         callback(results,fields)
//         db.close(connection);
//     })
//
// }
//
// //关闭数据库
// db.close = function(connection){
//     //关闭连接
//     connection.end(function(err){
//         if(err){
//             return;
//         }else{
//             console.log('关闭连接');
//         }
//     });
// }
//
// //获取数据库连接
// db.connection = function(){
//     //数据库配置
//     let connection = mysql.createConnection({
//         host:'localhost',
//         user:'root',
//         password:'123456',
//         database:'oa',
//         port:3306
//     });
//     //数据库连接
//     connection.connect(function(err){
//         if(err){
//             console.log(err);
//             return;
//         }
//     });
//     return connection;
// }
// module.exports = db;


const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
var async = require("async");

const _config = require('../config.config');



// 数据库配置
let config = {
    connectionLimit : 500,
    host : _config.host,
    database : _config.database,
    user : _config.user,
    password : _config.password
};

// 创建一个数据库连接池
let pool = mysql.createPool(config)



/**
 * 用于执行数据库的SQL语句
 * @param sql
 * @param p
 * @param c
 */
exports.query = function (sql, p, c) {
    // 两个参数/三个参数
    let params = [];
    let callback;


    // 开始进行参数的匹配
    if (arguments.length === 2 && typeof arguments[1] === 'function') {
        // 两个参数的话，第一个参数是SQL语句，第二个参数是回调函数
        callback = p;
    } else if (arguments.length === 3  && typeof arguments[2] === 'function') {
        params = p;
        callback = c;
    } else {
        throw new Error('Sorry, 参数个数不匹配或参数类型错误！');
    }

    // if(propertis.database === undefined || propertis.user === undefined || propertis.password === undefined || propertis.host === undefined){
    //     propertis = getProperties();
    //     config = {
    //         connectionLimit : 50,
    //         host : propertis['host'],
    //         database : propertis['database'],
    //         user : propertis['user'],
    //         password : propertis['password']
    //     };
    //     pool = mysql.createPool(config)
    // }

    // 从数据库连接池中取出可以使用的链接
    pool.getConnection(function (err, connection) {

        connection.query(sql, params, function (err, rows) {
            // 使用完毕放回去连接池中，然后释放链接
            connection.release();
            callback.apply(null, arguments);
        });
    })
}



/**
 * 安装状态查询
 * @param pool
 * @param sql
 */
exports.queryInstall = function ( callback) {
    // 开始创建一个连接池
    pool.getConnection(function (err, connection) {
        if (err)
            return callback(err.sqlMessage || err, null);
        callback(null, {status : true});
    })
}

exports.getConnection = function(callback) {
    pool.getConnection(function (err, connection) {
        if (err)
            return callback(err ,null);
        callback(null, connection);
    })
}


/**
 * 开始批量执行程序的sql语句   待完善

 * @param sqlparamsEntities
 * @param callback
 */
exports.executeTransaction = function ( sqlparamsEntities, callback) {
    // 从数据库连接池中取出可以使用的链接
    pool.getConnection(function (err, connection) {

        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param, function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                throw tErr;
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });


            async.series(funcAry, function (err, result) {
                console.log("transaction error: " + err);
                 if (err) {
                    connection.rollback(function (err) {
                        console.log("transaction error: " + err);
                        connection.release();
                        return callback(err, null);
                    });
                } else {
                    connection.commit(function (err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function (err) {
                                console.log("transaction error: " + err);
                                connection.release();
                                return callback(err, null);
                            });
                        } else {
                            connection.release();
                            return callback(null, info);
                        }
                    })
                }
            })
        // connection.query(sql, function (err, rows) {
        //     // 使用完毕放回去连接池中，然后释放链接
        //     connection.release();
        //     callback.apply(null, arguments);
        // });
        })
    })
}


/**
 * 根据属性值获取数据值
 * @param name
 */
function getProperties(name) {
    try {
        var result = fs.readFileSync(path.join(__dirname, '../config.properties'), 'utf-8'),
            res = {};
        if (typeof result === 'string' && result.length !== 0){
            let properties = result.split('\n');
            properties.forEach(item=>{
                let ret = item.split('=');
                if (ret.length === 2) {
                    res[ret[0]] = ret[1];
                }
            })
        }
        return res;
    }catch (e) {
        return {
            host : undefined,
            database: undefined,
            user : undefined,
            password: undefined
        }
    }

}