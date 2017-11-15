const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin
// GET /signup 注册页
//checkNotLogin, 中间件暂时屏蔽
router.get('/', function (req, res, next) {
	console.log('login in');
	res.render('signup');
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('注册')
})

module.exports = router

