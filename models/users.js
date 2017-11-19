const User = require('../lib/mongo').User;
module.exports = {
	create: function create(user){
		return User.create(user).exec()
	},
	getUserByname: function getUserByname(name){ 
		return User
			.findOne({name: name})
			.addCreatedAt()
			.exec()
	}
}