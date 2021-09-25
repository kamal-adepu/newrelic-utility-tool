// REQUIRE CONTROLLER
const AlertsController = require('../controllers/newrelicAlerts.js');

module.exports = app => {
  
  app.post('/bulk/delete', AlertsController.bulkdeleteAlerts);

  app.post('/bulk/nrql/create', AlertsController.createnrqlbulkAlerts);

};
