// 根据当前process.env.NODE_ENV环境变量对配置文件进行导入
module.exports = require('./env/' + process.env.NODE_ENV + '.js');