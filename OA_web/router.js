const express = require('express');
// const app = express();
const router = express.Router();
// const config = require('./config');
// const fs = require('fs');

// const installController = require('./controllers/install');
// const indexController = require('./controllers/index');
const userController = require('./controllers/user');
const depController = require('./controllers/dep');
// const playController = require('./controllers/play');
// const commentController = require('./controllers/comment');
// const movieController = require('./controllers/movie');
// const colmovieController = require('./controllers/moviecol');


// 前台路由控制中心-------------------------------------------------------------------------------------------------------------------

router.post('/doLogin', userController.doLogin);                          // 用户登录
router.post('/doAddUser', userController.doAddUser);//添加用户

router.get('/getUsersByDepId', userController.getUsersByDepId);
router.get('/getUserById', userController.getUserById);

router.get('/getDepsByPId', depController.getDepsByPId);
router.get('/getDepById', depController.getDepById);

module.exports = router;