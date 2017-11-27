const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const CommentModel = require('../models/comments')
const PostModel = require('../models/posts')

router.get('/', function(req, res, next){
  const author = req.query.author
  PostModel.getPosts(author)
    .then(function(posts){
	    res.render('posts',{
        initData: posts
      });
    })
    .catch(next)
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

//具体文章页
router.get('/:postId', function(req, res, next){
  const postId = req.params.postId;
  Promise.all([
    PostModel.getPostById(postId),    //获取文章信息
    CommentModel.getComments(postId),   //获取文章下面的所有留言
    PostModel.incPc(postId)            //pv加1
  ])
  .then(function(result){
    const post = result[0];
    const comments = result[1];
	  res.render('topic',{
      post: post,
      comments: comments
    });
  })
  .catch(next)
})
// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id
  PostModel.getRawPostById(postId)
    .then(function(post){
      if(!post){
        throw new Error('该文章不存在')
      }
      if(author.toString() !== post.author._id.toString()){
        throw new Error('权限不足')
      }
      res.render('edit',{
        post: post 
      })
    })
    .catch(next)
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.delPostById(postId)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/posts')
        })
        .catch(next)
    })
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
  try{
    if(!title){
      throw new Error('标题不能为空')
    }
    if(!content){
      throw new Error('内容不能为空')
    }
     PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.updatePostById(postId, { title: title, content: content })
        .then(function () {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
  }catch(e){
    req.flash('error', e.message)
    return res.redirect('back')
  }
  

  console.log(title,content);
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