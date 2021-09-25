var XLSX = require('xlsx')
fs = require('fs');

module.exports.getxlsxtoJson = function (file_path){
    var workbook = XLSX.readFile(file_path);
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    return xlData
}

module.exports.populate_data = function(jsonData){
    let updatedData = []
    for(const ele of jsonData) {  
    //console.log(ele)
    new_data = {}
    new_data['policy_number'] = ele['policy_number']
    new_data['data'] = {}
    new_data['data']['nrql_condition'] = {}
    new_data['data']['nrql_condition']['name'] = ele['name']
    new_data['data']['nrql_condition']['enabled'] = ele['enabled']
    new_data['data']['nrql_condition']['type'] = ele['type']
    new_data['data']['nrql_condition']['value_function'] = ele['value_function']
    new_data['data']['nrql_condition']['violation_time_limit_seconds'] = ele['violation_time_limit_seconds']
    new_data['data']['nrql_condition']['terms'] = []
    terms_data = {}
    terms_data['duration'] = ele['terms_duration']
    terms_data['operator'] = ele['terms_operator']
    terms_data['priority'] = ele['terms_priority']
    terms_data['threshold'] = ele['terms_threshold']
    terms_data['time_function'] = ele['terms_time_function']
    new_data['data']['nrql_condition']['terms'].push(terms_data)
    new_data['data']['nrql_condition']['nrql'] = {}
    new_data['data']['nrql_condition']['nrql']['query'] = ele['nrql_query'].replace('"', '').replace(/\\"/g,'');
    new_data['data']['nrql_condition']['nrql']['since_value'] = ele['nrql_since_value']
    new_data['data']['nrql_condition']['signal'] = {}
    new_data['data']['nrql_condition']['signal']['aggregation_window'] = ele['signal_aggregation_window']
    new_data['data']['nrql_condition']['signal']['evaluation_offset'] = ele['signal_evaluation_offset']
    new_data['data']['nrql_condition']['signal']['fill_option'] = ele['signal_fill_option']
    updatedData.push(new_data)
    };
    return updatedData;
}
 

module.exports.populate_synthetics_data = function(jsonData){

    let updatedData = []
    for(const ele of jsonData) {  
        new_data = {}
        new_data['data'] = {}
        new_data['data']['name'] = ele['name']
        new_data['data']['frequency'] = ele['frequency']
        new_data['data']['type'] = ele['type'].toLowerCase()
        new_data['data']['status'] = ele['status']
        new_data['data']['uri'] = ele['uri']
        new_data['data']['locations'] = ele['locations'].split(",")
        new_data['data']['slaThreshold'] = "0.1"
        // new_data['data']['options'] = {}
        // new_data['data']['options']['validationString'] = ele['options_validationString']
        // new_data['data']['options']['verifySSL'] = ele['options_verifySSL']
        // new_data['data']['options']['bypassHEADRequest'] = ele['options_bypassHEADRequest']
        // new_data['data']['options']['treatRedirectAsFailure'] = ele['options_treatRedirectAsFailure']
        if(ele['type'].toLowerCase() == "script_api"){
            fs.writeFileSync(__basedir+'/uploads/test_script.js', ele['script'])
            //console.log('data added to file');
            new_data['script'] = fs.readFileSync(__basedir+'/uploads/test_script.js', 'base64')
            updatedData.push(new_data)
        }else if(ele['type'].toLowerCase() == "script_browser"){
            fs.writeFileSync(__basedir+'/uploads/test_script.js', ele['script'])
            //console.log('data added to file2');
            new_data['script'] = fs.readFileSync(__basedir+'/uploads/test_script.js', 'base64')
            updatedData.push(new_data)
            
        }else{
            new_data['script'] = ""
            updatedData.push(new_data)
        }    
    };
    return updatedData;

}

module.exports.populate_synthetics_delete_data = function(jsonData){

    let updatedData = []
    for(const ele of jsonData) {  
        updatedData.push(ele['name'])  
    };
    return updatedData;

}


module.exports.waitforme = function(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    });
}