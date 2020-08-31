import { apiService } from '../apiService';
import {makeMetricsToDownload} from './makeMetricsToDownload';
import {makeResumeData} from './makeResumeData';
import {makeSetRocCurves} from './makeSetRocCurves';

export const getMetrics = async (loadedMetrics) => {
  const res =  loadedMetrics || await apiService.get('metrics')  
  console.log(res)
  if (res.status === 200) {
    localStorage.setItem('metrics', JSON.stringify(res))

    const { metrics } = res.data;

    const isMultiClass = metrics.isMultiClass
    const filename = metrics.filename
    const trainTime = metrics.train_time
    const metricsTrain = JSON.parse(metrics.metricsTrain)
    const metricsTest = JSON.parse(metrics.metricsTest)
    const bestModel = metrics.best_model;
    const datasetType = res.data.datasetType;
    const testSize = parseFloat(metrics.splitSize) * 100
    var rocPointsTrain = null
    var rocPointsTest = null

    if (!isMultiClass) {
      rocPointsTrain = makeSetRocCurves(metricsTrain, 'Train')
      rocPointsTest = makeSetRocCurves(metricsTest, 'Test')

    }

    const metricsToDownload = makeMetricsToDownload(metricsTrain, isMultiClass)    
    const resume = makeResumeData(metrics)

    const resultsMetrics = {
      "isMultiClass": isMultiClass,
      "filename": filename,
      "trainTime": trainTime,
      "testSize": testSize,
      "datasetType": datasetType,
      "metricsTrain": metricsTrain,
      "metricsTest": metricsTest,
      "metricsToDownload": metricsToDownload,
      "resume": resume,
      "rocPointsTrain": rocPointsTrain,
      "rocPointsTest": rocPointsTest,
      "bestModel": bestModel,
    }
    
    return (resultsMetrics);  
    
    



  }

}