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
     		failureRedirect: '/signin',
     		failureFlash: true  //是否使用flash消息
     }));

  // 登出路由设置 
  app.get('/signout', users.signout);

  app.route('/merchants')
     .get(users.getIdentity, users.listByIdentity, users.renderMerchants);

  app.route('/merchants/:merchantId')
     .get(users.requiresLogin, users.hasAuthorization, users.renderMerchantUpdate)
     .post(users.requiresLogin, users.hasAuthorization, users.getIdentity, users.updateMerchant);

  app.route('/merchants/:merchantId/delete')
     .get(users.requiresLogin, users.hasAuthorization, users.deleteMerchant, users.renderMerchants);

  app.param('merchantId', users.merchantByID);
};
