var 
  users = require('../../app/controllers/users.server.controller'),
  passport = require('passport');

module.exports = function(app){
	// 注册路由设置
  app.route('/signup')
     .get(users.renderSignup)
     .post(users.signup);

  // 登录路由设置
  app.route('/signin')
     .get(users.renderSignin)
     .post(passport.authenticate('local', {
     		successRedirect: '/',
     		failureRedirect: '/',
     		failureFlash: true  //是否使用flash消息
     }));

  // 登出路由设置 
  app.get('/signout', users.signout);


  // app.route('/users')
  // 	 .post(users.create)
  // 	 .get(users.list);

  // app.route('/users/:userId')
  // 	 .get(users.read)
  // 	 .put(users.update)
  // 	 .delete(users.delete);

  // app.param('userId', users.userById);
};
