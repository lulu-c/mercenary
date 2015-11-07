var 
  users = require('../../app/controllers/users.server.controller'),
  relations = require('../../app/controllers/relations.server.controller');


module.exports = function(app){
  app.route('/relations')
     .get(relations.list, relations.relationsRender);

  app.route('/relations/:relationId')
     .get(relations.hosts, relations.renderUpdate)
     .post(relations.hostMatch, relations.update);

  app.route('/relations/:relationId/delete')
     .get(relations.delete);

  app.param('relationId', relations.relationByID);
};
