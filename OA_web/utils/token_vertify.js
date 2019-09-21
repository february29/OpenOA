var jwt = require('jsonwebtoken');
var signkey = 'february29';

exports.setToken = function(info){
    return new Promise((resolve,reject)=>{
        const token = jwt.sign(info,signkey,{ expiresIn:'24h' });
        resolve(token);
    })
}

exports.verToken = function(token){
    return new Promise((resolve,reject)=>{
        // token.split(' ')[1]
       jwt.verify(token,signkey,(error, decoded) => {
                if (error) {
                    console.log(error.message)

                    reject(error);
                }else{
                    // console.log(decoded)
                    resolve(decoded);
                }

        });

    })
}
