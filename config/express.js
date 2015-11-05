var 
  express = require('express'),  // 
  morgan = require('morgan'),  // 提供简单的日志中间件
  compress = require('compression'),  // 提供响应内容的压缩功能
  bodyParser = require('body-parser'),  // 包含几个处理请求数据的中间件
  methodOverride = require('method-override');  // 提供了对HTTP DELETE和PUT两个遗留方法的支持




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


  require('../app/routes/index.server.routes.js')(app);
  return app;
}