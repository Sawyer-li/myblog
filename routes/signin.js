const express = require('express');
const router = express.Router();
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next){
	res.send('登入页');
})

router.post('post', checkNotLogin, function(req, res, next){
	res.send('登入');
})
module.exports = router;