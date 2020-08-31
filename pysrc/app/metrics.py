from sklearn import metrics
from sklearn.metrics import confusion_matrix
from sklearn.metrics import roc_curve, auc 
import matplotlib.pyplot as plt
import seaborn as sn
import pickle
import math as mt
import pandas as pd
import numpy as np
import base64
import re
from joblib import dump, load

plt.switch_backend('Agg')
def warn(*args, **kwargs):
    pass
import warnings
warnings.filterwarnings("ignore", "(?s).*MATPLOTLIBDATA.*", category=UserWarning)
warnings.filterwarnings("ignore")
warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.warn = warn


def precision(self,label, confusion_matrix):
    col = confusion_matrix[:, label]
    return confusion_matrix[label, label] / col.sum()

def recall(self,label, confusion_matrix):
    row = confusion_matrix[label, :]
    return confusion_matrix[label, label] / row.sum()

def acurracy(self,confusion_matrix):
    diagonal =confusion_matrix.diagonal().sum()
    total =confusion_matrix.sum()
    return (diagonal/total)*100

    
def makeConfusionMatrix(path,cm,name,size,decoded_classes):    
    cm_df = pd.DataFrame(cm,index = decoded_classes, columns = decoded_classes)

    plt.figure(figsize=(6.25,6.25))
    sn.heatmap(cm_df, cmap="Blues",annot=True,cbar=False,fmt='g',annot_kws={"size": 19})
    sn.set(font_scale=1.4)#for label size
    plt.title(name+" "+size)
    plt.ylabel('True label')
    plt.xlabel('Predicted label')

    plt.savefig(path+'/cm'+name+size+'.png', dpi=300, facecolor='w', edgecolor='w',
            orientation='portrait', papertype=None, format=None,
            transparent=False, bbox_inches=None, pad_inches=0.1) 

    with open(path+"/cm"+name+size+".png", "rb") as image_file:                 
            encoded_string = str(base64.b64encode(image_file.read()))  
    return encoded_string[2:-1]

def getTrainingMetrics(path,train_dataset,y_train,classes,decoded_classes,algorithms_dict,algorithms_obj,algorithms_real_name,splitSize,isMultiClass):
    
    pattern = re.compile(".*PROB")  
    col_proba = list(filter(pattern.search, train_dataset.columns.values.astype(str)))
    
    col_pred = [x.replace('PROB','').strip() for x in col_proba]
                
    roc_auc = dict()                            
    if(len(classes) > 2):
        isMultiClass = True
        metrics_ = pd.DataFrame(None, index=col_pred, columns=['ALG','ALGNAME','ACCU','SENS','VPP','MCC','GRIDSEARCH','ISBEST','CMBINARY'])                                   
    else:            
        isMultiClass = False
        metrics_ = pd.DataFrame(None, index=col_pred, columns=['ALG','ALGNAME','TN','FP','FN','TP','ACCU','SENS','SPEC','VPP','VPN','MCC','GRIDSEARCH','ISBEST','ROC','CMBINARY'])                
        for i in range(0,len(col_proba)):            
            fpr, tpr, _ = roc_curve(y_train, train_dataset[col_proba[i]],pos_label=1)            
            auc_value = auc(fpr,tpr)
            roc_auc[i] = {'x':fpr, 'y':tpr,'auc':auc_value}
                    
    for i in range(0, len(col_pred)):
        if isMultiClass:
            cm = confusion_matrix(y_train, train_dataset[col_pred[i]],labels=classes)  
            trainSize = 'Train '+ str(100 - splitSize*100) +' %'     
            binaryPNGconfusionMatrix= makeConfusionMatrix(path,cm, algorithms_dict[i],trainSize,decoded_classes)
            
            # METRICS FOR MULTI
            metrics_.loc[col_pred[i]]['ALG'] = algorithms_dict[i]
            metrics_.loc[col_pred[i]]['ALGNAME'] = algorithms_real_name[i]
            metrics_.loc[col_pred[i]]['ACCU'] = acurracy(cm)
            metrics_.loc[col_pred[i]]['SENS'] = metrics.recall_score(y_train,train_dataset[col_pred[i]],average='weighted')*100     
            # metrics_.loc[col_pred[i]]['SPEC'] = ((tn)/(tn+fp))*100
            metrics_.loc[col_pred[i]]['VPP'] =  metrics.precision_score(y_train,train_dataset[col_pred[i]],average='weighted')*100 #VPP 
            # metrics_.loc[col_pred[i]]['VPN'] = ((tn)/(tn+fn))*100
            metrics_.loc[col_pred[i]]['MCC'] =  metrics.matthews_corrcoef(y_train,train_dataset[col_pred[i]])
            metrics_.loc[col_pred[i]]['ISBEST'] = False
            metrics_.loc[col_pred[i]]['CMBINARY'] = binaryPNGconfusionMatrix
            metrics_.loc[col_pred[i]]['GRIDSEARCH'] = algorithms_obj[i].get_best_params()
        
        else:                
                
            tn, fp, fn, tp = confusion_matrix(y_train, train_dataset[col_pred[i]]).ravel()     
                    
            cm = np.array([[tp,fp],[fn,tn]])  
            trainSize = 'Train '+ str(100 - splitSize*100) +' %'     
            binaryPNGconfusionMatrix= makeConfusionMatrix(path,cm, algorithms_dict[i],trainSize,decoded_classes)                                                    
            # METRICS FOR BINARY
            metrics_.loc[col_pred[i]]['ALG'] = algorithms_dict[i]
            metrics_.loc[col_pred[i]]['ALGNAME'] = algorithms_real_name[i]
            metrics_.loc[col_pred[i]]['TN'] = tn
            metrics_.loc[col_pred[i]]['FP'] = fp
            metrics_.loc[col_pred[i]]['FN'] = fn
            metrics_.loc[col_pred[i]]['TP'] = tp
            metrics_.loc[col_pred[i]]['ACCU'] = ((tp+tn)/(tp+tn+fp+fn))*100
            metrics_.loc[col_pred[i]]['SENS'] = ((tp)/(tp+fn))*100
            metrics_.loc[col_pred[i]]['SPEC'] = ((tn)/(tn+fp))*100
            metrics_.loc[col_pred[i]]['VPP'] = ((tp)/(tp+fp))*100
            metrics_.loc[col_pred[i]]['VPN'] = ((tn)/(tn+fn))*100
            metrics_.loc[col_pred[i]]['MCC'] = (((tp*tn)-(fp*fn)))/(mt.sqrt((tp+fn)*(tp+fp)*(tn+fp)*(tn+fn)))
            metrics_.loc[col_pred[i]]['ROC'] = roc_auc[i]
            metrics_.loc[col_pred[i]]['ISBEST'] = False
            metrics_.loc[col_pred[i]]['CMBINARY'] = binaryPNGconfusionMatrix
            metrics_.loc[col_pred[i]]['GRIDSEARCH'] = algorithms_obj[i].get_best_params()
            
    
    
    metrics_.sort_values(by=['ACCU'], inplace=True,ascending=False)      
    metricsTrain = metrics_.to_json(orient='records')   
    metrics_.to_csv (path+'/metrics_train.csv', index = None, header=True)
    train_dataset.to_csv(path+'/train_dataset.csv', index = None, header=True)             
    return metricsTrain,metrics_
 

                    
def saveBestModel(path,algorithms_dict,train_algorithm,metrics_):
    
    metrics_['ACCU']=metrics_['ACCU'].astype('float64')
    best_accuracy = algorithms_dict.index(metrics_.loc[metrics_['ACCU'].idxmax(), 'ALG'])        
    
    bestModelName = metrics_['ACCU'].idxmax()        
    metrics_.loc[metrics_['ACCU'].idxmax(), 'ISBEST'] = True   
    best_model = train_algorithm[best_accuracy]
                    
    bestModelFilename = path+'/best_model_'+bestModelName+'.joblib'    
    dump(best_model, bestModelFilename) 
    return bestModelFilename,bestModelName, metrics_['ACCU'].max()

                        
def getValidationTestMetrics(path,test_dataset,X_test,y_test,decoded_classes,algorithms_obj,algorithms_dict,splitSize,isMultiClass,bestModelName,bestModelFilename):
    loaded_model = load(bestModelFilename) 
    
    y_pred = loaded_model.predict(X_test)
    y_prob = loaded_model.predict_proba(X_test)
        
    test_dataset[bestModelName] = y_pred
    test_dataset[bestModelName+' PROB'] = y_prob[:,1]
    
    if not isMultiClass:
    
        for i in range(0, len(algorithms_dict)):
            if(algorithms_dict[i] == bestModelName):
                gridSearch = algorithms_obj[i].get_best_params()                                                   
        
        fpr, tpr, _ = roc_curve(y_test, y_prob[:,1],pos_label=1)
    
        aucvalue = auc(fpr, tpr)
        roc_auc = {'x':fpr, 'y':tpr,'auc':aucvalue}
        
        tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
        cm = np.array([[tp,fp],[fn,tn]])          
        testSize = 'Test '+str(splitSize*100)+' %'
        binaryPNGconfusionMatrix= makeConfusionMatrix(path,cm,bestModelName,testSize,decoded_classes)      
        
        
        test_dataset.to_csv(path+'/test_dataset.csv', index = None, header=True) 

        index = []
        index.append(bestModelName)
        metricsTest = pd.DataFrame(None,index= index, columns=['ALG','ALGNAME','TN','FP','FN','TP','ACCU','SENS','SPEC','VPP','VPN','MCC','GRIDSEARCH','ROC','CMBINARY'])                
        
        metricsTest.loc[bestModelName]['ALG'] = bestModelName
        metricsTest.loc[bestModelName]['ALGNAME'] = bestModelName #RealName!!
        metricsTest.loc[bestModelName]['TN'] = tn
        metricsTest.loc[bestModelName]['FP'] = fp
        metricsTest.loc[bestModelName]['FN'] = fn
        metricsTest.loc[bestModelName]['TP'] = tp
        metricsTest.loc[bestModelName]['ACCU'] = ((tp+tn)/(tp+tn+fp+fn))*100
        metricsTest.loc[bestModelName]['SENS'] = ((tp)/(tp+fn))*100
        metricsTest.loc[bestModelName]['SPEC'] = ((tn)/(tn+fp))*100
        metricsTest.loc[bestModelName]['VPP'] = ((tp)/(tp+fp))*100
        metricsTest.loc[bestModelName]['VPN'] = ((tn)/(tn+fn))*100
        metricsTest.loc[bestModelName]['MCC'] = (((tp*tn)-(fp*fn)))/(mt.sqrt((tp+fn)*(tp+fp)*(tn+fp)*(tn+fn)))
        metricsTest.to_csv(path+'/metricsTest.csv', index = None, header=True) 
        
        
        metricsTest.loc[bestModelName]['GRIDSEARCH'] = gridSearch
        metricsTest.loc[bestModelName]['ROC'] = roc_auc            
        metricsTest.loc[bestModelName]['CMBINARY'] = binaryPNGconfusionMatrix
        
        metricsTest = metricsTest.to_json(orient='records')    
        return metricsTest    




