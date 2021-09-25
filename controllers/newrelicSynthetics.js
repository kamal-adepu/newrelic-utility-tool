const uploadFile = require("../middleware/upload.js");
const helper = require("../helper.js");
var axios = require('axios');
const excel = require("exceljs");

module.exports = {
  async getMonitors(req, res, next) { 
    
    try {   
      let all_monitors = await axios.get(monitor_link,{ headers: { 'X-Api-Key': AuthStr }})

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Tutorials");

      worksheet.columns = [
        { header: "Id", key: "id", width: 5 },
        { header: "Name", key: "name", width: 25 },
        { header: "Type", key: "type", width: 25 },
        { header: "Frequency", key: "frequency", width: 25 },
        { header: "URI", key: "uri", width: 10 },
        { header: "Locations", key: "locations", width: 10 },
        { header: "Status", key: "status", width: 10 },
        { header: "SlaThreshold", key: "slaThreshold", width: 10 },
        { header: "Options", key: "options", width: 10 },
        { header: "ModifiedAt", key: "modifiedAt", width: 10 },
        { header: "CreatedAt", key: "createdAt", width: 10 },
      ];
      let itemsProcessed = 0;

      all_monitors.data.monitors.forEach(async ele => {
        itemsProcessed++;
        ele.locations = ele.locations.toString();
        if(itemsProcessed === all_monitors.data.monitors.length) {
          let tutorials = all_monitors.data.monitors
          // Add Array Rows
          worksheet.addRows(tutorials);
          // res is a Stream object
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "synthetics_monitors.xlsx"
          );

          return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
          });
        }
      });


    } catch (err) {
      res.status(500).send({
        message: `Could not get the monitors: ${err}`,
      });
    }
   
  },
  async bulkCreate(req, res, next) {

    try {
      await uploadFile(req, res);
      let jsonData = helper.getxlsxtoJson(req.file.path)
      let populate_data = helper.populate_synthetics_data(jsonData)
      let url_main = 'https://synthetics.newrelic.com/synthetics/api/v3/monitors'      
      let itemsProcessed = 0;
      let scripted_synthetics = []
      let scripted_object = {}
      for(const ele of populate_data) {
          await helper.waitforme(1000);
          itemsProcessed++;  
          //console.log(ele.data)        
          axios.post(monitor_link,ele.data,{ headers: { 'X-Api-Key': AuthStr }}).then(function (response) {
            //console.log(ele.data)
            console.log(response.data)
          });

          if(ele.script != ""){
              scripted_synthetics.push(ele.data.name)
              scripted_object[ele.data.name] = ele.script
          }
          if(itemsProcessed === populate_data.length) {
              let url_script = ""
              let all_monitors = await axios.get(monitor_link,{ headers: { 'X-Api-Key': AuthStr }})
              //axios.get(url_main,{ headers: { 'X-Api-Key': AuthStr }}).then(function (all_monitors) {
              for(const ele1 of all_monitors.data.monitors) {
                if(scripted_synthetics.includes(ele1.name)){
                    post_obj = {}
                    post_obj['scriptText'] = scripted_object[ele1.name]
                    url_script = monitor_link+ele1.id+'/script'
                    console.log(url_script)
                    await helper.waitforme(1000);
                    axios.put(url_script,post_obj,{ headers: { 'X-Api-Key': AuthStr }})
                }
              }
              // }).catch(function (error) {
              //   // handle error
              //   console.log(error);
              // })
              
          } 
      }

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

    try {

      await uploadFile(req, res);
      let jsonData = helper.getxlsxtoJson(req.file.path)
      //console.log(jsonData)
      for(const ele1 of jsonData) {
        //console.log(ele1)
        let post_obj = {}
        post_obj['name'] = ele1['Name']
        post_obj['type'] = ele1['Type']
        post_obj['frequency'] = ele1['Frequency']
        if(ele1.hasOwnProperty('URI')){
          post_obj['uri'] = ele1['URI']
        }
        post_obj['locations'] = ele1['Locations'].split(",")
        post_obj['status'] = ele1['Status']
        post_obj['slaThreshold'] = ele1['SlaThreshold']
        let url_script = monitor_link+ele1['Id']
        axios.put(url_script,post_obj,{ headers: { 'X-Api-Key': AuthStr }})  
        await helper.waitforme(1000);        
      }
  

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
  
      res.status(200).send({
        message: "Synthetics are updated successfully as mentioned in : " + req.file.originalname,
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
  async bulkDelete(req, res, next) {
    try{

        await uploadFile(req, res);
        let jsonData = helper.getxlsxtoJson(req.file.path)
        let scripted_synthetics = helper.populate_synthetics_delete_data(jsonData)         
        let all_monitors = await axios.get(monitor_link,{ headers: { 'X-Api-Key': AuthStr }})
        for(const ele1 of all_monitors.data.monitors) {
          if(scripted_synthetics.includes(ele1.name)){
              url_script = monitor_link+ele1.id
              console.log(url_script)
              await helper.waitforme(1000);
              axios.delete(url_script,{ headers: { 'X-Api-Key': AuthStr }})
          }
        }

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