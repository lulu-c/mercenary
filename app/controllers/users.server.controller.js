var 
  User = require('mongoose').model('User'),  //返回创建的User模型
  crypto = require('crypto'),
  passport = require('passport'),
  moment = require('moment');


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
	// moment().format();
	// console.log(moment().calendar(null, 'Thu Nov 01 2015 23:16:39 GMT+0800 (中国标准时间)'));

  	if(!req.user){
	  	res.render('signin', {
	  		title: 'Sign-in Form',
	  		messages: req.flash('error') || req.flash('info')  //读取flash区域中所存储的消息
	  	});
	  }else{
	  	return res.redirect('/');
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


var identities = {
  admins: function(){
    return "管理员";
  },
  merchants: function(){
  	return "商家";
  },
  hosts: function(){
  	return "主持";
  }
};

// 获取路由中的idetity字符串
exports.getIdentity = function(req, res, next){
  var urlArray = req.url.split('/');
  console.log(urlArray[1]);
  req.identity =  identities[urlArray[1]](); 
  next();
};

// 显示某种类型身份的所有文档信息
exports.listByIdentity = function(req, res, next){
	User.find({
		identity: req.identity
	}).sort('-join').exec(function(err, users){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			// res.json(users);
			req.merchants = users;
			next();
		}
	});
	// return users;
};

//通过id获取文档
exports.merchantByID = function(req, res, next, id){
	User.findById(id).exec(function(err, user){
		if(err){
			return next(err);
		}

		if(!user){
			return next(new Error('Failed to load merchant' + id));
		}

		req.merchant = user;
		next();
	});
};

// 渲染视图：商家列表
exports.renderMerchants = function(req, res, next){
	res.render('list-merchants', {
		title: '商家列表',
		user: req.user ? req.user : '',
		merchants: req.merchants,
		messages: req.flash('error')  //读取flash区域中所存储的消息
	});
};

// 渲染视图：商家信息
// exports.renderMerchant = function(req, res, next){
// 	res.render('update-merchant', {
// 		title: '修改信息',
// 		user: req.user ? req.user : '',
// 		merchant: req.merchant,
// 		messages: req.flash('error')  //读取flash区域中所存储的消息
// 	});
// };

// 渲染视图：修改商家信息
exports.renderMerchantUpdate = function(req, res, next){
  res.render('update-merchant', {
    title: '修改商家信息',
    user: req.user ? req.user : '',
    merchant: req.merchant,
    messages: req.flash('error')  
  });
}



// 更新文档
exports.updateMerchant = function(req, res, next){
	var user = req.merchant;

	user.username = req.body.username;
	user.password = req.body.password;
	user.name = req.body.name;

	var md5 = crypto.createHash('md5');
        user.passwordHash = md5.update(req.body.password).digest('hex');
	
	user.save(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			req.merchant = user;
			return res.redirect('/'+ req.url.split('/')[1]);
		}
	});
};

// 删除文档
exports.deleteMerchant = function(req, res){
	var user = req.merchant;

	user.remove(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			req.merchant = null;
		}
	});
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

// 实现授权中间件
exports.hasAuthorization = function(req, res, next){
  if(req.user.identity !== "管理员"){  // 确定当前操作的用户是否为管理员
  	return res.status(403).send({
  		message: "User is not authorized"
  	});
  }

  next();
};



