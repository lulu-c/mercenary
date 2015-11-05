var 
  passport = require('passport'),  //passport模块
  localStrategy = require('passport-local').Strategy,  //本地策略模块
  User = require('mongoose').model('User');  //自定义的User Mongoose模型


module.exports = function(){
  //使用passport.use()方法注册了策略，该方法中传入的本地策略的实例
  passport.use(new localStrategy(function(username, password, done){
  	User.findOne({
  		username: username
  	}, function(err, user){
  		if (err) {
  			return done(err);
  		}

  		if(!user){
  			return done(null, false, {
  				message: 'Unknown user'
  			});
  		}

  		if(!user.authenticate(password)){
  			return done(null, false, {
  				message: 'Invalid password'
  			});
  		}

  		return done(null, user);

  	});
  }));
};