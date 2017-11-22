const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function(req, res, next){
	res.render('posts');
})

router.post('/create', checkLogin, function(req, res, next){
	res.send('发布文章页');
})

router.get('/create', checkLogin, function(req, res, next){
	
	res.render('create');
})

router.get('/:postId', function(req, res, next){
	res.send('文章详情页');
})
// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
  res.send('创建留言')
})

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function (req, res, next) {
  res.send('删除留言')
})

module.exports = router