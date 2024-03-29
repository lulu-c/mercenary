var
  config = require('./config'), 
  express = require('express'),  // 
  morgan = require('morgan'),  // 提供简单的日志中间件
  compress = require('compression'),  // 提供响应内容的压缩功能
  bodyParser = require('body-parser'),  // 包含几个处理请求数据的中间件
  methodOverride = require('method-override'),  // 提供了对HTTP DELETE和PUT两个遗留方法的支持
  session = require('express-session'),
  passport = require('passport'),
  flash = require('connect-flash');



module.exports = function(){
  var app = express();  //创建了Express应用的实例
  
  if(process.env.NODE_ENV === 'development'){  //对系统环境进行判定
  	app.use(morgan('dev'));
  }else if(process.env.NODE_ENV === 'production'){
  	app.use(compress());
  }

  app.use(bodyParser.urlencoded({
  	extended:true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:config.sessionSecret
  }));

  app.set('views','./app/views');	//设置视图文件的存储目录
  app.set('view engine', 'ejs');  //设置EJS作为Express应用的模板引擎

  app.use(flash());
  app.use(passport.initialize());  //注册了用于passport模块启动的中间件
  app.use(passport.session());  //注册了用于Express追踪用户会话的中间件

  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/users.server.routes.js')(app);

  app.use(express.static('./public'));  //先执行路由逻辑，若没有响应请求，再由静态文件服务进行处理
  return app;
}