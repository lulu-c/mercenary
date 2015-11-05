exports.render = function(req, res){
  if(req.session.lastVisit){
  	console.log(req.session.lastVisit);
  }
  req.session.lastVisit = new Date();  //记录最后一次请求时间

  res.render('index', {
  	title: 'Mercenary'
  });
};