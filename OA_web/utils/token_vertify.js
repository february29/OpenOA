var jwt = require('jsonwebtoken');
var signkey = 'february29';

exports.setToken = function(info){
    return new Promise((resolve,reject)=>{
        const token = jwt.sign(info,signkey,{ expiresIn:'1h' });
        resolve(token);
    })
}

exports.verToken = function(token){
    return new Promise((resolve,reject)=>{
        var info = jwt.verify(token.split(' ')[1],signkey);
        resolve(info);
    })
}
