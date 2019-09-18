

var db = require('./db');



let tableName = 'daily_flows'

    // `id` int(11) NOT NULL AUTO_INCREMENT,
    // `daily_id` int(11) DEFAULT NULL,
    // `info` varchar(45) DEFAULT NULL,
    // `commit_id` int(11) DEFAULT NULL,
    // `next_id` int(11) DEFAULT NULL,
    // `add_time` int(10) DEFAULT NULL,
    // `score` varchar(45) DEFAULT NULL,

function DailyFlow(dailyFlow) {
    this.id = dailyFlow.id;
    this.add_time = dailyFlow.add_time;
    this.daily_id = dailyFlow.daily_id;
    this.info = dailyFlow.info;
    this.commit_id = dailyFlow.commit_id;
    this.next_id = dailyFlow.next_id;
    this.score = dailyFlow.score;





}


DailyFlow.getFlowsByDailyId = function(dailyId,callback){
    db.query("select A.* , B.name as commitName , C.name as nextName"  +
        " from daily_flows  A " +
        " left join users B on A.commit_id = B.id" +
        " left join users C on A.next_id = C.id" +
        " where A.daily_id = ?" +
        " order by add_time ASC ", [dailyId], function (err, result) {
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
DailyFlow.prototype.save = function (callback) {


    db.query('INSERT  INTO  ' +tableName + " SET ?",
        {
            add_time :this.add_time,
            daily_id : this.daily_id,
            info : this.info,
            commit_id : this.commit_id,
            next_id : this.next_id,
            score : this.score,
        },
        function(err, result) {
          if (err) {
                callback(err, null);

            }else{
                callback(null, result);
            }
    });



}

module.exports = DailyFlow;