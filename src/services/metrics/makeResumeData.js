
 export const makeResumeData = (values) => {
    const data = [
      {
        "step": "Null Imputer",
        "quantity": values.nullValuesCount + " null values",
        "algorithm": values.answers.imputer,
        "action": null,
        "choices": ""
      }, {
        "step": "Normalize",
        "quantity":  (values.continuousColumns.length) + " continuous columns", //total values of norm
        "algorithm": values.answers.normalize,
        "action": "See Columns",
        "choices": values.continuousColumns,
        "type": "Continuous Columns"
      }, {
        "step": "Encode",
        "quantity": values.categoricalColumns.length + "  categorical columns",
        "algorithm": values.answers.encoder,
        "action": "See Columns",
        "choices": values.categoricalColumns,
        "type": "Categorical Columns"
      } 
    ]

    var smote = values.answers.smote &&  {
      "step": "Over Sample",
      "quantity": "Before: " +values.answers.smote.total.before + "   |    After: "+ values.answers.smote.total.after ,
      "algorithm": "SMOTE",
      "action": "See by classes", 
      "choices": values.answers.smote.classes,       
      "type": ""
    } 
    
    values.answers.smote && data.push(smote);    
      
    if (values.newHeaders.length < values.originalHeaders.length || values.answers.feature_selector !== 'Do not select') {
      // const headersWithInfo =  values.newHeaders.map(nh => {
      //   values.categoricalColumns.include(nh)
      // })
      const headerWithInfo = []
      values.newHeaders.map(nh => {

        if(values.categoricalColumns.includes(nh)){
          headerWithInfo.push({name:nh,type:"Categorical"})
        }

        if(values.continuousColumns.includes(nh)){
          headerWithInfo.push({name:nh,type: "Continuous"})
        }

        return headerWithInfo;
      })
            
      var feature_selector =  
        {
          "step": "Feature Selector",
          "quantity": "Selected " + (values.newHeaders.length) + " of " + (values.originalHeaders.length) + ' features',
          "algorithm": values.answers.feature_selector.algorithm,
          "estimator": 'Fitter: ' + values.answers.feature_selector.estimator,
          "action": "See features",
          "chart": values.answers.rfecv_chart,
          "choices": headerWithInfo,
          "type": "Selected Columns"
        }    
        data.push(feature_selector);
      }

    return data;

  }
