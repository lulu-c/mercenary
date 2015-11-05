// process.env.NODE_ENV的默认值为development，如果默认值没有设置，则会设置为development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var 
  mongoose = require('./config/mongoose'),
  express = require('./config/express');

var db = mongoose();
var app = express();
app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000');