import warnings
warnings.filterwarnings("ignore")
from .events import socketio
import pandas as pd
import numpy as np
import re
import base64
import csv
from collections import Counter
from imblearn.over_sampling import SMOTE
from app.preprocessing import Pipe
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
# from .metrics import Metrics
from .train import Train
from .detectors import Detect
from .metrics import getTrainingMetrics,getValidationTestMetrics,saveBestModel


class Methods():
    def __init__(self):
        self.train_dataset = None
        self.test_dataset = None
        self.splitSize = None
        self.X_test = None
        self.y_test = None
        self.X_train = None
        self.y_train = None
        self.headers = None
        self.original_headers = None
        self.algorithms_real_name = None
        self.algorithms_dict = None        
        self.algorithms_obj = None
        self.train_algorithm = None
        self.pipe = None
        self.pos_label = None
        self.classes = None
        self.decoded_classes = [1,0]  
        self.selections = None
        self.folds = []
        self.splits = 10
        self.steps = None
        self.options = None             
        self.isMultiClass= None
        self.nullValuesCount = None
        self.filename = ''
        self.train_obj = Train()
        self.detect = Detect()
        
             
    def read(self,path,filename):
        try:
       
            ptail = re.search(r"\.(\w+)$", path).group(1)       
            if(ptail == 'csv'):                
                sniffer = csv.Sniffer()
                sample_bytes = 32
                dialect = sniffer.sniff(open(path).read(sample_bytes))                
                self.train_dataset = pd.read_csv(path,sep=dialect.delimiter)                  
            elif(ptail == 'xlsx'):
                self.train_dataset = pd.read_excel(path,index_col = False) 
                self.train_dataset = pd.DataFrame(self.train_dataset)
            self.headers = list(self.train_dataset.columns.values)
            self.original_headers = self.headers
        
            self.setXtrain_ytrain()                
            self.getClasses()     
            if(len(self.classes) == 2):                
                self.isMultiClass = False
            else:                  
                self.isMultiClass = True
                                                                 
            self.pipe = Pipe()
            self.filename = filename
            return True                    
        except:            
            return False,None
                
#    DATASET SETS
    def setSplit(self,option):   
        self.splitSize = option
        self.splitTestTrain(option)   

    def splitTestTrain(self,option):
 
        X_train, X_test, y_train, y_test = train_test_split(self.X_train, self.y_train, test_size=option,shuffle=True)
        
        self.X_test = X_test
        self.y_test = y_test
        self.setTestDataset()

        self.X_train = X_train
        self.y_train = y_train
        self.setTrainDataset()  

    def setTrainDataset(self):     
        self.train_dataset = pd.DataFrame(self.X_train,columns=self.headers[:-1])
        self.train_dataset[self.headers[-1]] = self.y_train

    def setTestDataset(self):
        self.test_dataset = pd.DataFrame(self.X_test,columns=self.headers[:-1])
        self.test_dataset[self.headers[-1]] = self.y_test
    
    def setXtrain_ytrain(self):
        self.X_train = np.array(self.train_dataset.iloc[:,:-1])
        self.y_train = np.array(self.train_dataset.iloc[:,-1]) 
        
    def setXtest_ytest(self):
        self.X_test = np.array(self.test_dataset[self.headers[:-1]])
        self.y_test = np.array(self.test_dataset.iloc[:,-1]) 
        self.setTestDataset()
            
    def detectMissingValues(self):
        train_dataset,test_dataset,nullValuesCount,missing_val_column_test,missing_val_column_train = self.detect.missvalues(self.train_dataset,self.test_dataset,self.headers)
        if(len(missing_val_column_train)>0 or len(missing_val_column_test)>0  ):
            self.train_dataset = train_dataset            
            self.setXtrain_ytrain()
            self.test_dataset = test_dataset
            self.setXtest_ytest()            
            self.nullValuesCount = nullValuesCount         
            return nullValuesCount,True
        self.nullValuesCount = nullValuesCount
        return nullValuesCount,False
           
    def imputeNullValues(self,steps,answers):        
        
            self.train_dataset,self.test_dataset = self.pipe.imputer(steps,answers,self.train_dataset,self.X_train,self.y_train,self.test_dataset,self.X_test,self.y_test,self.headers)                
            self.setXtrain_ytrain()
            self.setXtest_ytest()
        
    def getClasses(self):
        self.classes = []
        
        # Obtiene las clases desde y

        for c in self.y_train:
            if c not in self.classes:
                self.classes.append(c)                
         
        #Si es un dataset binario y está bien codificad, es decir
        #con clases [0,1] es decir 0 = Negativa  , 1 = P0sitiva 
        #Se setea la clase positiva el 1, se guardan las clases y se retorna false, 
        #por que no es necesario encodear

        if 0 in self.classes and 1 in self.classes and len(self.classes) == 2:
            self.pos_label = 1   
    
            self.classes=[1,0]          
            return False #NO LLAMA A SETEAR LA CLASE POSITIVA

        # Si es multiclase, no importa la clase positiva
        # Solo se guardan las clases     

        elif(len(self.classes) > 2):

            return False #NO LLAMA A SETEAR LA CLASE POSITIVA
        
        # LLAMA a definir la clase positiva
        else:                        
            return self.classes
    
        
    def setPositiveClass(self,pos_class):
        self.pos_label = str(pos_class)
        self.decoded_classes = []
        self.decoded_classes.append(str(pos_class))
        print(self.decoded_classes)

        #Si es un dataset binario se reemplaza la positiva por 1 y la negativa por 0
        #Puede ser reemplazado por un encoder        
        if 0 not in self.classes and len(self.classes) == 2: 
            temp_train_dataset =  str(self.train_dataset.iloc[:,-1])
            temp_train_dataset = self.train_dataset.iloc[:,-1].astype('str')
            temp_train_dataset = temp_train_dataset.replace(self.pos_label,'replace')

            temp_test_dataset =  str(self.test_dataset.iloc[:,-1])
            temp_test_dataset = self.test_dataset.iloc[:,-1].astype('str')
            temp_test_dataset = temp_test_dataset.replace(self.pos_label,'replace')
            

            for x in self.classes:
                if str(x) != self.pos_label:      
                                 
                    self.decoded_classes.append(str(x))
    
                    temp_train_dataset = temp_train_dataset.replace(str(x),0)
                    temp_train_dataset = temp_train_dataset.replace('replace',1)

                    temp_test_dataset = temp_test_dataset.replace(str(x),0)
                    temp_test_dataset = temp_test_dataset.replace('replace',1)
            
            self.train_dataset.iloc[:,-1] = temp_train_dataset 
            self.test_dataset.iloc[:,-1] = temp_test_dataset 
            
            self.setXtrain_ytrain()
            self.setXtest_ytest()
            self.getClasses() 
            
        # FALTA CASO MULTICLASE CON ENCODER despues del ELse
        else:
            print("isMulticlass")

    def pipeColumnsTransformer(self,steps,answers,normColumns,catColumns):   
        self.train_dataset,self.test_dataset = self.pipe.columnsTransformer(steps,answers,self.train_dataset,self.test_dataset,self.classes,normColumns,catColumns)        
        self.setXtrain_ytrain()
        self.setXtest_ytest()
      
    def pipeFeatureSelector(self,steps,options,path):                
        self.train_dataset , self.headers = self.pipe.featureSelect(steps,options,self.train_dataset,self.X_train,self.y_train,self.headers,path)        
        self.setXtrain_ytrain()
        self.setXtest_ytest()
   
    def isBalanced(self):        
        return self.detect.isBalanced(self.y_train,self.classes,self.isMultiClass)
                
    def balance(self):        
        try:
            self.X_train,self.y_train = self.detect.balanceWithSmote(self.X_train,self.y_train)        
            self.setTrainDataset()
            return True
        except:
            return False
        
            
# INFO COLUMNAS Y TRATAMIENTO
                
    def getColumnsInfo(self):
        return self.headers,self.columnTypes()
    
    def setHeaders(self,_headers,_dtype):
        norm_columns_options= []
        cat_columns_options=[]
        no_encoded_cat_columns_options=[]
        for x in range(len(_headers)):
            if(_dtype[x] == 'continua'):
                norm_columns_options.append( _headers[x] )
            elif(_dtype[x] == 'categorica no codificada'):
                no_encoded_cat_columns_options.append(_headers[x] )
                cat_columns_options.append(_headers[x] )
            elif(_dtype[x] == 'categorica codificada'):
                cat_columns_options.append(_headers[x] )

        return norm_columns_options,no_encoded_cat_columns_options,cat_columns_options

    def columnTypes(self):
        column_data_types = []
        for c in self.train_dataset.columns:  
   
            if(self.train_dataset[c].dtypes == 'object'):
                try:
                    self.train_dataset[c] = pd.to_numeric(self.train_dataset[c])   
                 
                except:                                        
                    column_data_types.append('categorica no codificada')                  
            if(self.train_dataset[c].dtypes == 'float64'):
                column_data_types.append('continua')
            if(self.train_dataset[c].dtypes == 'int64'):
                
                column_data_types.append('categorica codificada')
                            
        return column_data_types

    def get_total_features(self):
        return len(self.train_dataset.columns)-1
    
# ENTRENAMIENTO

    

    def set_algorithms(self,steps,options):    
        self.steps = steps    
        self.options = options            
        self.algorithms_dict,self.algorithms_real_name,self.algorithms_obj = self.train_obj.set_algorithms(steps,options,self.X_train,self.y_train)

    def set_train(self):        
        for s in range (self.splits):
            self.folds.append('FOLD '+str(s))        

    def  train(self):
        self.set_train()
        self.train_algorithm = self.train_obj.train(self.train_dataset,self.X_train,self.y_train,self.algorithms_obj,self.algorithms_dict,self.splits,self.folds)
        
    def metrics(self,path,answers,continuousColumns,categoricalColumns,encodedCatColumns,train_time):             
        trainingMetrics,trainingMetricsDataframe = getTrainingMetrics(path,self.train_dataset,self.y_train,self.classes,self.decoded_classes,self.algorithms_dict,self.algorithms_obj,self.algorithms_real_name,self.splitSize,self.isMultiClass)                
        bestModelFilename,bestModelName,bestModelAccuracy = saveBestModel(path,self.algorithms_dict,self.train_algorithm,trainingMetricsDataframe)           
        validationTestMetrics = getValidationTestMetrics(path,self.test_dataset,self.X_test,self.y_test,self.decoded_classes,self.algorithms_obj,self.algorithms_dict,self.splitSize,self.isMultiClass,bestModelName,bestModelFilename)        
        return self.generateResponse(path,
                                    answers,
                                    continuousColumns,
                                    categoricalColumns,
                                    encodedCatColumns,
                                    trainingMetrics,
                                    bestModelFilename,
                                    bestModelName,
                                    bestModelAccuracy,
                                    validationTestMetrics,train_time)



  
    def generateResponse(self,path,answers,continuousColumns,categoricalColumns,encodedCatColumns,metricsTrain,bestModelFilename,bestModelName,bestModelAccuracy,metricsTest,train_time):
        
        choices = self.set_choices(answers,path)
        data = {            
            "filename":self.filename, 
            "train_time":train_time,
            "splitSize":self.splitSize,
            "continuousColumns":continuousColumns,
            "categoricalColumns":(encodedCatColumns),
            "originalHeaders":self.original_headers,
            "newHeaders":self.headers,
            "answers":choices,
            "isMultiClass": self.isMultiClass,
            "nullValuesCount":self.nullValuesCount,                                     
            "best_model":{
                "name":bestModelName,
                "accuracy":bestModelAccuracy,
                "path":bestModelFilename
            },
            "metricsTest":metricsTest,
            "metricsTrain":metricsTrain,      
        }
        return data
    

    def set_choices(self,answers,path):    
        choices = dict()   
        for i,s in enumerate(self.steps):            
            if(s == 'feature_selector'):                           
                choices["feature_selector"] = answers[i][s]   
                if  answers[i][s]['algorithm']  == "Recursive Feature Elimination CV":
                    with open(path+"/RFECV_Plot.png", "rb") as image_file:                 
                        encoded_string = str(base64.b64encode(image_file.read()))
                        RFECVCHART = encoded_string[2:-1]
                        choices["rfecv_chart"]= RFECVCHART,
                else: choices["rfecv_chart"]= "",
            if(s == 'normalize'):
                choices["normalize"] = answers[i][s]    
            if(s == 'encoder'):
                choices["encoder"] = answers[i][s]   
            if(s == 'norm_columns'):
                choices["norm_columns"] = answers[i][s]  
                   
            if(s == 'encoder_columns'):
                choices["encoder_columns"] = answers[i][s]          
            if(s == 'algorithms'):
                choices["algorithms"] = answers[i][s]   
            if(s == 'imputer'):
                choices["imputer"] = answers[i][s]  
            if(s == 'balance'):                                                                            
                new_classes_count = []
                new_classes_count.append(self.detect.count_before_smote)
                new_classes_count.append(self.detect.count_after_smote)
                        
                choices["smote"] = {
                                "total":{
                                    "before":str(self.detect.total_before_smote),
                                    "after":str(self.detect.total_after_smote)
                                },
                                "classes":{ "headers":['Class','Before','After'],"index":self.classes, "values":new_classes_count}
                                }                
                
                
        return choices


    