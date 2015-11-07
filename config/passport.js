var 
  passport = require('passport'),
  mongoose = require('mongoose');

module.exports = function(){
  var User = mongoose.model('User');

  passport.serializeUser(function(user, done){  //用于定义passport处理用户信息的方法
  	done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
  	User.findOne({
  		_id: id
  	}, '-password -passwordHash -salt', function(err, user){  //传入-password -salt参数防止读取password和salt属性
  		done(err, user);
  	});
  });

  require('./strategies/local.js')();
};