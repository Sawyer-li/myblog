const Post = require('../lib/mongo').Post
const marked = require('marked')
const CommentModel = require('./comments')

Post.plugin('addCommentsCount', {
	afterFind: function (posts){
		return Promise.all(posts.map(function(post){
			return CommentModel.getCommentsCount(post._id).then(function(commentsCount){
				post.commentsCount = commentsCount
				return post
			})
		}))
	},
	afterFindOne: function (post){
		if(post){
			return CommentModel.getCommentsCount(post._id).then(function(count){
			    post.commentsCount = count
        		return post
			})
		}
		return post
	}
})

Post.plugin('contentToHtml',{
	afterFind: function (posts){
		return posts.map(function(post){
			post.content = marked(post.content)
			return post
		})
	},
	afterFindOne: function (post){
		if(post){
			post.content = marked(post.content)
		}
		return post
	}
})

module.exports = {
	//创建一片文章
	create: function create(post){
		return Post.create(post).exec()
	},
	//通过id获取一篇文章
	getPostById: function getPostById (postId) {
		return Post
			.findOne({ _id: postId })
			.populate({path: 'author',model: 'User'})
			.addCreatedAt()
			.addCommentsCount()
			.contentToHtml()
			.exec()
	},
	//按时间降序获取所有用户文章或者某个特定用户文章
	getPosts: function getPosts(author){
		const query = {}
		if(author){
			query.author = author
		}
		return Post
			.find(query)
			.populate({path: 'author',model: 'User'})
			.sort({ _id: -1 })
      		.addCreatedAt()
      		.addCommentsCount()
			.contentToHtml()
			.exec()
	},
	//通过文章id给pv加1
	incPc: function incPc(postId){
		return Post
			.update({_id: postId},{$inc: {pv: 1}})
			.exec()
	},
	//通过文章id获取一个编辑的文章
	getRawPostById: function getRawPostById(postId) {
		return Post
		.findOne({_id: postId})
		.populate({path: 'author',model: 'User'})
		.exec()
	},
	updatePostById: function updatePostById (postId, data){
		return Post
			.update({_id:postId}, {$set:data})
			.exec()
	},
	delPostById: function delPostById (postId){
		return Post.remove({_id: postId}).exec()
			.then(function(res){
				if(res.result.ok && res.result.n > 0){
					return CommentModel.delCommentsByPostId(postId)
				}
			})
	}
}