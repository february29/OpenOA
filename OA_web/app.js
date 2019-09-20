var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require("fs");
var ejs = require('ejs');  //我是新引入的ejs插件
// 引入json解析中间件
var bodyParser = require('body-parser');

const token_verify = require('./utils/token_vertify');

var app = express();


// const router = require('./router');





//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由
// app.use(router);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var depsRouter = require('./routes/deps');
var dailyRouter = require('./routes/daily');
var uploadRouter = require('./routes/upload');








app.use(function (req, res, next) {


    // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验
    if (req.url != '/doLogin' && req.url != '/doLogin') {

        var par = req.method == 'GET'?req.query:req.body;
        var token = req.headers.token;
        if (!token){
            token = par.token;
        }
        if (!token){
            res.send({status: 403, msg: '请传递参数token'});
        }else{
            token_verify.verToken(token).then((data)=> {
                req.data = data;
                return next();
            }).catch((error)=>{
                console.log(error.message)
                res.send({
                    status: 403,
                    msg: '登录已过期,请重新登录'});

            })
        }


        // jwt.verify(token, _config.jsonwebtokenkey, (error, decoded) => {
        //     if (error) {
        //         console.log(error.message)
        //         // res.send({status: 403, msg: '登录已过期,请重新登录'}
        //         return
        //     }
        //     console.log(decoded)
        //     next()
        // })




    } else {
        next();
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload',uploadRouter);
app.use('/deps',depsRouter);
app.use('/daily',dailyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

    console.log(err);
  res.render('error');
});

module.exports = app;
