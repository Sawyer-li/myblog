const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');

const checkNotLogin = require('../middlewares/check').checkNotLogin;
//, checkNotLogin
router.get('/', function(req, res, next){
	res.render('signin');
})

//checkNotLogin,
router.post('/',  function(req, res, next){
	const name = req.fields.name;
	const password = req.fields.password;
	console.log(name,password);
	try {
		if(!name.length){
			throw new Error('请填写用户名');
		}
		if(!password.length){
			throw new Error('填写密码');
		}
	}catch(e){
		req.flash('error',e.message);
		return res.redirect('back');
	}

	UserModel.getUserByname(name)
		.then(function(user){
			if(!user){
				req.flash('error','用户名不存在');
				return res.redirect('back');
			}
			if(sha1(password) !== user.password){
				req.flash('error','密码不正确');
				return res.redirect('back');
			}
			req.flash('success','登入成功');
			delete user.password;
			req.session.user = user;
			res.redirect('/posts');
		})
})

module.exports = router;