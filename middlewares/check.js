module.exports = {
	checkLogin: function checkLogin (req, res, next){
		console.log(req.session.user);
		if(!req.session.user){
			req.flash('error','未登入');
			return res.redirect('/signin');
		}
		next();
	},
	checkNotLogin: function checkNotLogin(req, res, next){
		if(req.session.user){
			req.flash('error','已登入');
			return res.redirect('back');
		}
		next();
	}
}