const uploadFile = require("../middleware/upload.js");
const helper = require("../helper.js");
var axios = require('axios')

module.exports = {
  async bulkCreate(req, res, next) { 
    
    try {

      await uploadFile(req, res);
      let jsonData = helper.getxlsxtoJson(req.file.path)
      let populate_data = helper.populate_synthetics_data(jsonData)
      let url_main = 'https://synthetics.newrelic.com/synthetics/api/v3/monitors'      
      let itemsProcessed = 0;
      let scripted_synthetics = []
      let scripted_object = {}
      populate_data.forEach(async ele => {
        itemsProcessed++;
        await axios.post(url_main,ele.data,{ headers: { 'X-Api-Key': AuthStr }})
        

        if(ele.script != ""){
            scripted_synthetics.push(ele.data.name)
            scripted_object[ele.data.name] = ele.script
        }
        if(itemsProcessed === populate_data.length) {
            let url_script = "---I am inside end----"
            console.log()
            console.log(scripted_synthetics)
            console.log(scripted_object)
            let all_monitors = await axios.get(url_main,{ headers: { 'X-Api-Key': AuthStr }})
            all_monitors.data.monitors.forEach(async ele1 => {
                if(scripted_synthetics.includes(ele1.name)){
                    post_obj = {}
                    post_obj['scriptText'] = scripted_object[ele1.name]
                    url_script = 'https://synthetics.newrelic.com/synthetics/api/v3/monitors/'+ele1.id+'/script'
                    console.log(url_script)
                    axios.put(url_script,post_obj,{ headers: { 'X-Api-Key': AuthStr }})
                }
            });
        }     
      });

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      res.status(200).send({
        message: "Synthetics are created successfully as mentioned in : " + req.file.originalname,
      });

    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
        });
      }
  
      res.status(500).send({
        message: `Could not create the synthetics: ${err}`,
      });
    }
   
  },
  async bulkUpdate(req, res, next) {

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
  async bulkDelete(req, res, next) {

    try{
        
        let scripted_synthetics = ['monitor1','monitor_testing_new','monitor_scripting_monitirng','monitor4']
        let url_main = 'https://synthetics.newrelic.com/synthetics/api/v3/monitors'  
        let all_monitors = await axios.get(url_main,{ headers: { 'X-Api-Key': AuthStr }})
        all_monitors.data.monitors.forEach(async ele1 => {
            if(scripted_synthetics.includes(ele1.name)){
                url_script = 'https://synthetics.newrelic.com/synthetics/api/v3/monitors/'+ele1.id
                console.log(url_script)
                axios.delete(url_script,{ headers: { 'X-Api-Key': AuthStr }})
            }
        });

        res.status(200).send({
            message: "Synthetics are deleted successfully as mentioned in : " + req.file.originalname,
        });

    }catch(err){
      res.status(500).send({
        message: `Could not upload the file: ${err}`,
      });
    }
  }
}