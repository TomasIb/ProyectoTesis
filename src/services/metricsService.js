export const metricsService = {

  setRocCurves: function (metrics) {
    try {
        const chartColors = ['#5603ad', '#00f2c3', '#f5365c', '#2dce89', '#e14eca', '#ffd600', '#ff8d72','#2dce4b']
        var legend = metrics.map(val => { return val.ALG });
        var curves = metrics.map(val => { return val.ROC });
        var curvesPoints = []
        for (let i = 0; i < curves.length; i++) {
        var points = []
        for (let j = 0; j < curves[i].x.length; j++) {
            points.push({ 'x': curves[i].x[j], 'y': curves[i].y[j] })
        }
        curvesPoints.push(
            {
            "id": legend[i],
            "color": chartColors[i],
            "data": points,
            })
        }
    return curvesPoints;
        
    } catch (error) {
        return error;        
    }
    // if (type === 'Train') {
    //   setRocPointsTrain(curvesPoints)
    // } else
    //   if (type === "Test") {
    //     setRocPointsTest(curvesPoints)
       
    //   }
  },
  prepareMetricsToDownload : function (metricsTrain90, isMultiClass){
    if (!isMultiClass) {
      const preparedMetrics = metricsTrain90.map((item) => {
        return {
          "Algorithm": item.ALGNAME,
          "Accuracy": item.ACCU,
          "Sensitivity": item.SENS,
          "Specificity": item.SPEC,
          "MCC": item.MCC,
          "VPP": item.VPP,
          "VPN": item.VPN,
          "TP": item.TP,
          "TN": item.TN,
          "FP": item.FP,
          "FN": item.FN,
          "ISBEST": item.ISBEST
        }
      });
      return preparedMetrics;
    } else {
      const preparedMetrics = metricsTrain90.map((item) => {
        return {
          "Algorithm": item.ALGNAME,
          "Accuracy": item.ACCU,
          "Sensitivity": item.SENS,
          // "Specificity":item.Spec,
          "MCC": item.MCC,
          "VPP": item.VPP,
          "ISBEST": item.ISBEST
          // "VPN":item.VPN,
          // "TP":item.TP,
          // "TN":item.TN,
          // "FP":item.FP, 
          // "FN":item.FN}});

        }
      });
      return preparedMetrics;
    }
  },
  prepareResumeData: function(values) {

    var featuresSelected = ""
    if (values.newHeaders.length < values.originalHeaders.length || values.answers.feature_selector !== 'Do not select') {
      featuresSelected = "Selected " + (values.newHeaders.length) + " of " + (values.originalHeaders.length)
    }

    var normalize = ""
    if (values.answers.normalize === "Yes") {
      normalize = "MinMaxScaler"
    }else{
      normalize =values.answers.normalize
    }

    const data = [
      {
        "step": "Null Imputer",
        "affected": values.nullValuesCount + " Values",
        "algorithm": values.answers.imputer,
        "action": "",
        "choices": ""
      },{
        "step": "Normalize",
        "affected": values.answers.norm_columns.length + " of " + (values.continuousColumns.length) + " Continous Columns", //total values of norm
        "algorithm": normalize,
        "action": "See Columns",
        "choices": values.continuousColumns,
        "type":"Continuous Columns"
      }, {
        "step": "Encoder",
        "affected": values.answers.encoder_columns.length+" of "+values.categoricalColumns.length+" Categorical Columns",
        "algorithm": values.answers.encoder,
        "action": "See Columns",
        "choices": values.categoricalColumns,
        "type":"Categorical Columns"
      },{
        "step": "Feature Selector",
        "affected": featuresSelected,
        "algorithm": values.answers.feature_selector,
        "action": " See Details",
        "chart":values.answers.rfecv_chart,
        "choices": values.newHeaders,
        "type":"Selected COlumns"
      }
    ]
    return data;

  }
}


