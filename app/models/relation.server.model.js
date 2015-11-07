var 
  mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

var RelationSchema = new Schema({  //使用模式构造器定义了UserSchema对象模式
  merchant: { // 商家
  	type: Schema.ObjectId,
    ref: 'User'
  },
  merchantName: {
    type: String,
    default: null
  },
  host: {  //主持
  	type: Schema.ObjectId,
    ref: 'User',
    default: null
  },
  hostName: {
    type: String,
    default: null
  }
});

mongoose.model('Relation', RelationSchema);  //使用模式实例定义了User模型