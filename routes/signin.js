const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');

const checkNotLogin = require('../middlewares/check').checkNotLogin;
//, checkNotLogin
router.get('/', function(req, res, next){
	res.render('signin');
})

router.post('post', checkNotLogin, function(req, res, next){
	const name = req.fields.name;
	const password = req.fields.password;
})
module.exports = router;