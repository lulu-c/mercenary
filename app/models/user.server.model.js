var 
  mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({  //使用模式构造器定义了UserSchema对象模式
  username: { // 账号
  	type: String,
  	unique: true,
  	trim: true
  },
  password: {  //密码
  	type: String,
  	validate:[
  	  function(password){
  	  	return password && password.length > 2;
  	  }, 'password should be longer'
  	]
  },
  passwordHash: {
    type: String
  },
  name: {  //昵称
  	type: String,
  	trim: true
  },
  identity: {  //身份
  	type: String,
  	enum: ['管理员','商家','主持']
  },
  join: {  //加入时间
  	type: Date,
  	default: Date.now
  },
  salt: {  //用于对密码进行哈希
  	type: String
  },
  provider: {  //用于标明注册用户时所采用的passport策略类型
  	type: String,
  	required: 'provider is required'
  },
  providerId: String,  //用于标明身份验证策略的用户标志符
  providerData: {}  //用于存储从OAuth提供方获取的用户信息
});

UserSchema.pre('save', function(next){  
	if(this.password){
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');  //用伪随机方法生成了一个盐
		this.passwordHash = this.hashPassword(this.password);  //用实例方法对原密码执行哈希操作
	}
	next();
});

// 通过crypto模块执行用户密码的哈希
UserSchema.methods.hashPassword = function(password){  
  return crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('base64');
};

// 将接收的参数字符串的哈希结果与数据库中存储的用户密码哈希值进行比较
UserSchema.methods.authenticate = function(password){
  return this.passwordHash == this.hashPassword(password);
};

// 为用户确定一个唯一可用的用户名
UserSchema.statics.findUniqueUsername = function(username, suffix, callback){
  var _this = this;
  var possibleUsername =  username + (suffix || '');

  _this.findOne({
  	username: possibleUsername
  }, function(err, user){
  	if(!err){
  		if(!user){
  			callback(possibleUsername);
  		}else{
  			return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
  		}
  	}else{
  		callback(null);
  	}
  });
};

mongoose.model('User', UserSchema);  //使用模式实例定义了User模型