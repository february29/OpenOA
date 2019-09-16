var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');  //用来生成token
const User = require('../models/user');
const _config = require('../config.config');

router.post('/doLogin', function (req, res, next) {
    // 1. 获取用户输入的参数信息
    let username = req.body.username;
    let password = req.body.password;


    if (!username || !password ) {
        return res.json({
            code : -1,
            msg : '参数错误'
        });
    }
    // 开始获取用户的默认IP信息
    // let ip = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress;
    //
    // // 开始获取用户的地址信息
    // let address = '未知地址';
    //
    //
    // let ipInfo = utils.getIPInfo(ip);
    // let area = ipInfo.Area && ipInfo.Area.indexOf('本机地址') !== -1 ? ipInfo.Area : '';
    // address = `${ipInfo.Country}${area}`;
    //
    // // 2. 开始校验（防止用户端禁用js）， 查询比对的实际上是加密过后的数据信息
    // // 开始进行数据加密(对用户的密码进行双重加密+加上自己的密匙)
    // pwd = utility.md5(pwd);
    // // 对密码进行再次加密
    // pwd = utility.md5(pwd + req.app.locals.config.secretKey);

    // 3. 开始具体的业务逻辑校验
    // 3.1 用户是否存在（根据用户名查询出来用户记录信息）
    User.getUserByUsername(username, function (err, result) {
        // 如果结果不存在的话
        if (!result) {
            // 用户不存在
            return res.json({
                code: 0,
                msg: '该用户不存在'
            });
        }

        // 用户存在的话就开始校验密码是否正确
        if (password !== result.password) {
            return res.json({
                code: 0,
                msg: '密码错误'
            });
        }
        // // 写入数据到session
        // req.session.user = result;
        // // 获取用户的ID信息
        // let user_id = result.id;


        // // console.log(login_time, ip, address, user_id);
        // // 用户登录成功之后，开始吧用户的登录日志写入到数据库
        // let userlog = new Userlog({
        //     login_time,
        //     ip,
        //     address,
        //     user_id
        // });
        // // console.log(address, userlog, result);
        // // 3.2 密码是否正确,如果密码正确，就直接写入数据到session，跳转到首页
        // userlog.save(function (err, result) {
        //     if (err) {
        //         return next(err);
        //     }
        //     //console.log('用户的登录日志文件已经成功写入到数据库！', result)
        // })

        let info = {id:result.id,name:result.name};
        let token = jwt.sign(info, _config.jsonwebtokenkey, {
            expiresIn: 60*60*1  // 1小时过期
        });

        jwt.verify(token, _config.jsonwebtokenkey, (error, decoded) => {
            if (error) {
                console.log(error.message)
                return
            }
            console.log(decoded)
        })
        console.log(token);


        // 跳转到首页
        res.json({
            code: 1,
            msg: 'success',
            data:result
        });
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.type('html');
  res.render('index', { title: 'Express' });
});

module.exports = router;
