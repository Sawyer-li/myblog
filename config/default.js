module.exports = {
	port: 3000,
	session: {
	    secret: 'myblog',
	    key: 'myblog',
	    maxAge: 2592000000                //过期时间约为一个月如果不注销
	},
	mongodb: 'mongodb://localhost:27017/myblog'
}

