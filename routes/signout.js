const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
	req.session.user = null;
	req.flash('success','成功登入');
	res.redirect('/post');
})

module.exports = router