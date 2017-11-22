const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
//checkLogin,
router.get('/',  function (req, res, next) {
	req.session.user = null;
	req.flash('success','成功注销');
	res.redirect('/posts');
})

module.exports = router