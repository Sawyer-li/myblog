const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
//checkNotLogin, 中间件暂时屏蔽
router.get('/', function (req, res, next) {
	console.log('login in');
	res.render('signup');
})
// checkNotLogin, 
// POST /signup 用户注册
router.post('/',function (req, res, next) {
	const name = req.fields.name;
	const gender = req.fields.gender;
	let password = req.fields.password;
	const repassword = req.fields.repassword;
	//个人简介
	const bio = req.fields.bio;
	//保存文件
	const avatar = req.files.avatar.path.split(path.sep).pop();
	try {
		if(!(name.length>=1&&name.length<=10)){
			throw new Error('名字请在1-10个字');
		}
		if(['m','f','x'].indexOf(gender) === -1){
			throw new Error('性别只能是m、f或x');
		}
		if(!(bio.length>=1&&bio.length<=30)){
			throw new Error('个人介绍应该在1-30之间');
		}
		if(!req.files.avatar.name){
			throw new Error('请上传头像');
		}
		if(password.length<6){
			throw new Error('密码长度不能小于6位');
		}
		if(password !== repassword){
			throw new Error('两次密码长度不一致');
		}
	}catch (e){
		//删除上传的头像
		fs.unlink(req.files.avatar.path);
		req.flash('error',e.message);
		return res.redirect('/signup');
	}
	console.log('start');
	console.log(name,gender,bio);
	res.send('注册')
}) 

module.exports = router

