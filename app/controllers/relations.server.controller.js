var 
  User = require('mongoose').model('User'),  //返回创建的User模型
  Relation = require('mongoose').model('Relation');  //返回创建的User模型


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


// 创建关系文档
exports.create = function(req, res, next){
	if(req.user.identity == '商家'){
		var relation = new Relation();  // 使用HTTP req.body 创建了模型的实例
		console.log(req.user);
		relation.merchant = req.user; 
		relation.merchantName = req.user.name;

	    relation.save(function(err){  //调用模型的save()方法保存文档
	    	if(err){
	    		return res.status(400).send({
	    			message: getErrorMessage(err)
	    		});
	    	}else{
	    		return res.redirect('/');
	    	}
	    });
	}else{
		return res.redirect('/');
	}
};

// 显示所有文档信息
exports.list = function(req, res, next){
	Relation.find().sort('-1').exec(function(err, relations){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			req.relations = relations;
			next();
		}
	});
};


// 渲染视图：商家列表
exports.relationsRender = function(req, res, next){
	res.render('relations-list', {
		title: '关系列表',
		user: req.user ? req.user : '',
		relations: req.relations,
		messages: req.flash('error')  //读取flash区域中所存储的消息
	});
};



// 通过id获取文档
exports.relationByID = function(req, res, next, id){
	Relation.findById(id).exec(function(err, relation){
		if(err){
			return next(err);
		}

		if(!relation){
			return next(new Error('Failed to load relations' + id));
		}

		req.relation = relation;
		next();
	});
};

// 获取主持文档
exports.hosts = function(req, res, next){
	User.find({
			identity: '主持'
		}).sort('-join').exec(function(err, users){
			if(err){
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			}else{
				req.hosts = users;
				next();
			}
		});
};

// 渲染视图：修改商家信息
exports.renderUpdate = function(req, res, next){
  res.render('relation-update', {
    title: '商家分配',
    user: req.user ? req.user : '',
    relation: req.relation,
    hosts: req.hosts,
    messages: req.flash('error')  
  });
};



// 获取分配的主持对象文档
exports.hostMatch = function(req, res, next){
	var id = req.body.host;
	User.findById(id).exec(function(err, user){
			if(err){
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			}else{
				req.hoster = user;
				next();
			}
	});
};

// 更新文档
exports.update = function(req, res){
	var relation = req.relation;

	relation.host = req.hoster;
	relation.hostName = req.hoster.name;

	relation.save(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			return res.redirect('/relations');
		}
	});
};


// 删除文档
exports.delete = function(req, res){
	var relation = req.relation;

	relation.host = null;
	relation.hostName = null;

	relation.save(function(err){
		if(err){
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			return res.redirect('/relations');
		}
	});
};