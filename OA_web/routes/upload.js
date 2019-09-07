var express = require('express');
var router = express.Router();
var db = require('../models/db');  //引入刚才自定义的模块

//文件上传中间件
var multer = require('multer');
//文件上传 设置
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            //file.originalname上传文件的原始文件名
            var changedName = (new Date().getTime())+'-'+file.originalname;
            cb(null, changedName);
        }
    }),
    imageFilter:function(req, file, cb){
        var acceptableMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
        //微信公众号只接收上述四种类型的图片
        if(acceptableMime.indexOf(file.mimetype) !== -1){
            cb(null, true)
        }else{
            cb(null, false)
        }
    },
    limits:{
        fieldSize: '2MB'
    }
});

var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

//文件上传
//单个文件上传
router.post('/single',upload.single('File'),(req,res)=>{
    console.log(req.file);
    console.log(res);



    db.insert( db.connection(),'INSERT INTO FILES SET ?',{name:req.file.originalname,path:req.file.path,fillpath:"",type:1},function (resultld) {

            res.json({
                code: '0000',
                type:'single',
                originalname: req.file.originalname
            })

    })

});

//多个文件上传
router.post('/multer',upload.array('File',5),(req,res)=>{


    console.log(req.files);
    let fileList = [];
    req.files.map((elem)=>{
        fileList.push({
            originalname: elem.originalname
        })
    });
    res.json({
        code: '0000',
        type:'multer',
        fileList:fileList
    });
});

// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });



module.exports = router;