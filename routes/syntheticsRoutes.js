// REQUIRE CONTROLLER
const SyntheticsController = require('../controllers/newrelicSynthetics.js');

module.exports = app => {
  
  app.post('/synthetics/bulk/create', SyntheticsController.bulkCreate);

  app.post('/synthetics/bulk/update', SyntheticsController.bulkUpdate);

  app.post('/synthetics/bulk/delete', SyntheticsController.bulkDelete);

};
