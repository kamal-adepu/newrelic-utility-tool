var XLSX = require('xlsx')

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
    new_data['data']['nrql_condition']['nrql']['query'] = ele['nrql_query']
    new_data['data']['nrql_condition']['nrql']['since_value'] = ele['nrql_since_value']
    new_data['data']['nrql_condition']['signal'] = {}
    new_data['data']['nrql_condition']['signal']['aggregation_window'] = ele['signal_aggregation_window']
    new_data['data']['nrql_condition']['signal']['evaluation_offset'] = ele['signal_evaluation_offset']
    new_data['data']['nrql_condition']['signal']['fill_option'] = ele['signal_fill_option']
    updatedData.push(new_data)
    };
    return updatedData;
}

