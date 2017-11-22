const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

const PostModel = require('../models/posts')

router.get('/', function(req, res, next){
	res.render('posts');
})

router.post('/create', checkLogin, function(req, res, next){
    const author = req.session.user._id
   	const title = req.fields.title
  	const content = req.fields.content
  	try{
  		if(!title.length){
  			throw new Error('请输入标题');
  		}
  		if(!content.length){
  			throw new Error('内容不能为空');
  		}
  	}catch(e){
  		req.flash('error',e.message)
  		return res.redirect('back');
  	}
  	let post = {
		author: author,
		title: title,
		content: content,
		pv: 0
	}
	PostModel.create(post)
	    .then(function (result) {
	      // 此 post 是插入 mongodb 后的值，包含 _id
	      post = result.ops[0]
	      req.flash('success', '发表成功')
	      // 发表成功后跳转到该文章页
	      res.redirect(`/posts/${post._id}`)
	    })
	    .catch(next)
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