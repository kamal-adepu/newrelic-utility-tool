const uploadFile = require("../middleware/upload.js");
const helper = require("../helper.js");
var axios = require('axios')

module.exports = {
  async bulkdeleteAlerts(req, res, next) {
    
    try {

      await uploadFile(req, res);
      jsonData = helper.getxlsxtoJson(req.file.path)
      jsonData.forEach(async ele => {
        alert_types = ele['Condition'].split(',')
        alert_types.forEach(async condition => {
          let url_main = 'https://api.newrelic.com/v2/'+condition+'.json?policy_id='+ele['Policy ID']
          const response_f = await axios.get(url_main, { headers: { 'X-Api-Key': AuthStr }})
          check = condition.replace("alerts_", "")
          if(response_f.data[check].length != 0){
              response_f.data[check].forEach(async element => {
                  let url = 'https://api.newrelic.com/v2/'+condition+'/'+element.id+'.json'
                  axios.delete(url, { headers: { 'X-Api-Key': AuthStr }})
              });
          }
        });
      });

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      res.status(200).send({
        message: "Alerts are deleted successfully mentioned in : " + req.file.originalname,
      });

    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
        });
      }
  
      res.status(500).send({
        message: `Could not delete the alerts: ${err}`,
      });
    }
   
  },
  async createnrqlbulkAlerts(req, res, next) {

    try{

      await uploadFile(req, res);
      jsonData = helper.getxlsxtoJson(req.file.path)
      populated_data = helper.populate_data(jsonData)

      populated_data.forEach(async ele => {

        let url_main = 'https://api.newrelic.com/v2/alerts_nrql_conditions/policies/'+ele['policy_number']+'.json'
        axios.post(url_main,ele['data'],{ headers: { 'X-Api-Key': AuthStr,'Content-Type': 'application/json' }})
      
      });

      res.status(200).send({message: "Alerts are created successfully from : " + req.file.originalname,});

    }catch(err){

      res.status(500).send({
        message: `Could not create the alert ${err}`,
      });

    }

  },
  async createscbulkAlerts(req, res, next) {

    try{

      await uploadFile(req, res);
      jsonData = helper.getxlsxtoJson(req.file.path)
      populated_data = helper.populate_data(jsonData)

      populated_data.forEach(async ele => {

        let url_main = 'https://api.newrelic.com/v2/alerts_nrql_conditions/policies/'+ele['policy_number']+'.json'
        axios.post(url_main,ele['data'],{ headers: { 'X-Api-Key': AuthStr,'Content-Type': 'application/json' }})
      
      });

      res.status(200).send({message: "Alerts are created successfully from : " + req.file.originalname,});

    }catch(err){

      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });

    }

  },
  async createsyntheticsbulkAlerts(req, res, next) {

    try{

      await uploadFile(req, res);
      jsonData = helper.getxlsxtoJson(req.file.path)
      populated_data = helper.populate_data(jsonData)

      populated_data.forEach(async ele => {

        let url_main = 'https://api.newrelic.com/v2/alerts_nrql_conditions/policies/'+ele['policy_number']+'.json'
        axios.post(url_main,ele['data'],{ headers: { 'X-Api-Key': AuthStr,'Content-Type': 'application/json' }})
      
      });

      res.status(200).send({message: "Alerts are created successfully from : " + req.file.originalname,});

    }catch(err){

      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });

    }

  }
}