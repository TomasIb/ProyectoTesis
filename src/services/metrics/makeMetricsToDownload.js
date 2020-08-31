export const makeMetricsToDownload = (metricsTrain, isMultiClass) => {
    if (!isMultiClass) {
      const preparedMetrics = metricsTrain.map((item) => {
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
      const preparedMetrics = metricsTrain.map((item) => {
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
  }