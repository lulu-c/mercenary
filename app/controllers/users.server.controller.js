var 
  User = require('mongoose').model('User'),  //返回创建的User模型
  passport = require('passport');


// 处理Mongoose错误对象并返回统一格式的错误消息
var getErrorMessage = function(err){
  var message = '';

  //两种错误
  if(err.code){  //MongoDB索引错误的错误代码
  	switch(err.code){
  		case 11000:
  		case 11001:
  		  message = 'Username already exists';
  		  break;
  		default:
  		  message = 'Something went wrong';
  	}
  }else{  //Mongoose校验错误的err.errors对象
  	for(var errName in err.errors){
  		if(err.errors[errName].message){
  			message = err.errors[errName].message;
  		}
  	}
  }

  return message;
};

// 渲染登录页面
exports.renderSignin = function(req, res, next){
  if(!req.isAuthenticated()){
  	if(!req.user){
	  	res.render('signin', {
	  		title: 'Sign-in Form',
	  		messages: req.flash('error') || req.flash('info')  //读取flash区域中所存储的消息
	  	});
	  }else{
	  	return res.redirect('/');
	  }
  }else{
  	return res.redirect('/index');
  }
};

// 渲染注册页面
exports.renderSignup = function(req, res, next){
	if(!req.user){
		res.render('signup', {
			title: 'Sign-up Form',
			messages: req.flash('error')  //读取flash区域中所存储的消息
		});
	}else{
		return res.redirect('/');
	}
};

// 注册页面业务逻辑处理
exports.signup = function(req, res, next){
	if(!req.user){
		var user = new User(req.body);  
		var message = null;

		user.provider = 'local';

		user.save(function(err){  //将user对象存入MongoDB
				if(err){  //错误处理
					var message = getErrorMessage(err);

					req.flash('error', message);  //将错误信息写入flash中
					return res.redirect('/signup');
				}

				req.login(user, function(err){  //用Express提供的login方法创建一个登录成功的用户会话
					if(err){
						return next(err);
					}
					return res.redirect('/');
				});
			});
	}else{
		return res.redirect('/');
	}
};

// 退出业务逻辑处理
exports.signout = function(req, res){
	req.logout();  //调用passport模块提供的方法，用于退出已验证的会话
	res.redirect('/');
};



// 实现身份验证中间件
exports.requiresLogin = function(req, res, next){
	if(!req.isAuthenticated()){  //调用Passport提供的方法来验证用户是否通过了身份验证
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};


