
import json
import re
import sys
from time import time
from app.methods import Methods
from app.massEspectrometry import MassEspectrometry
from app.questions import getMissValuesQuestion,getEncoderAlgorithmsQuestion,getFeatureSelectionQuestion,getMlAlgorithmsQuestion,getNormalizeQuestion,getPositiveTargetClassQuestion,getBalanceQuestion
def warn(*args, **kwargs):
    pass
import warnings
warnings.filterwarnings("ignore", "(?s).*MATPLOTLIBDATA.*", category=UserWarning)
warnings.filterwarnings("ignore")
warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.warn = warn


class Analysis():
    def __init__(self, _clientPath, isMassSpectrometryDataset,massSpectrometryParams):
        self.normColumns = None
        self.catColumns = None
        self.encodedCatColumns=None
        self.answers_read = []
        self.answers = []
        self.steptsDict = []
        self.actionsObject = Methods()        
        self.clientPath = _clientPath    
        self.train_time = 0

        self.isMassSpectrometryDataset = isMassSpectrometryDataset
        if(isMassSpectrometryDataset):
            self.massObject = MassEspectrometry(massSpectrometryParams)                               
        else: 
            self.massObject=None    

    def readDataset(self, path,filename):        
        res = self.actionsObject.read(path,filename)
        self.setColumnsType()
        return res

    def readDatasetMassSpect(self, path,filename):    
        res = self.massObject.main(path, self.clientPath)
        res = self.actionsObject.read(self.clientPath+"/FinalMassSpectrometryDatasetParsed.csv",filename)
        self.setColumnsType()
        return res

    def setTrainTestSplit(self,option):
        self.actionsObject.setSplit(option)  

    def detectMissingValues(self):
        nullValuesCount, res = self.actionsObject.detectMissingValues()
        if(res != False):
            return nullValuesCount, getMissValuesQuestion()
        return nullValuesCount, False

    def setMissValuesImputer(self, option):
        self.answers.append({'imputer': option})
        self.steptsDict.append('imputer')
        self.actionsObject.imputeNullValues(self.steptsDict, self.answers)

    def checkPositiveCategoricalTarget(self):
        classes = self.actionsObject.getClasses()
        if(classes != False):
            return getPositiveTargetClassQuestion(classes)
        else:
            return False

    def setPositiveCategoricalTarget(self, option):
        self.actionsObject.setPositiveClass(option)
        self.setColumnsType()
       
    def setColumnsType(self):
        headers, dtype = self.actionsObject.getColumnsInfo()        
        self.normColumns, self.catColumns,self.encodedCatColumns = self.actionsObject.setHeaders(headers, dtype)    

    def getEncoderAlgorithms(self):           
        if(len(self.catColumns) > 0):  # SI EXISTEN RETOARNA LAS COLUMNAS Y LOS ALGORITMOS
            question = getEncoderAlgorithmsQuestion()  
            return question          
        else:  # SI NO HAY COLUMNAS CATEGORICAS ENTONCES PROCEDE A REALIZAR SOLO A NORMALIZAR
            self.answers.append({'encoder': 'Do not encode'})
            self.steptsDict.append('encoder')

            self.answers.append({'encoder_columns': []})
            self.steptsDict.append('encoder_columns')            
            return False  

    def setEncoder(self,option):
            self.answers.append({'encoder': option})
            self.steptsDict.append('encoder')

            self.answers.append({'encoder_columns': self.catColumns})
            self.steptsDict.append('encoder_columns')
        
    def getNormalize(self):
        if(len(self.normColumns) > 0):  # SI EXISTEN RETOARNA PREGUNTA YES OR NO
            question = getNormalizeQuestion()  
            return question          
        else: 
            self.answers.append({'normalize': 'No'})
            self.steptsDict.append('normalize')  
            self.answers.append({'norm_columns': []})  
            self.steptsDict.append('norm_columns')                                           
            return False  
    
    def setNormalize(self,option):
        self.answers.append({'normalize': option})  
        self.steptsDict.append('normalize')  
        self.answers.append({'norm_columns': self.normColumns})
        self.steptsDict.append('norm_columns')  

        if option == 'No':
            self.answers.append({'norm_columns': []})
            self.steptsDict.append('norm_columns')    
     
     
    def igniteColumnsTransformer(self):
        self.actionsObject.pipeColumnsTransformer(self.steptsDict, self.answers,self.normColumns,self.catColumns)   

    def getFeatureSelectorAlgorithms(self):
       return getFeatureSelectionQuestion()

       
    def setFeatureSelector(self,option,param):
        self.answers.append({'feature_selector': {'algorithm':option, 'estimator':param} })
        self.steptsDict.append('feature_selector')
        self.actionsObject.pipeFeatureSelector(self.steptsDict, self.answers,self.clientPath)        
        return {'selected':len(self.actionsObject.headers),'original':len(self.actionsObject.original_headers)}

    def isBalanced(self):
        res =self.actionsObject.isBalanced()        
        if ( res == False):
            self.steptsDict.append('balance')               
            return getBalanceQuestion()
        else:
            return res
         
    def balance(self,option):           
        self.answers.append({'balance': option })
        if (option == 'Yes'):                                       
            return self.actionsObject.balance()
        else: return True
       

    def getHeaders(self):
        return self.actionsObject.headers

    def getDataset(self):
        return self.actionsObject.train_dataset.to_json(orient='records')    

    def getDatasetType(self):
        if self.isMassSpectrometryDataset:                          
            return "Binary Mass Spectrometry Dataset"            
        else:
            if self.actionsObject.isMultiClass:
                return "Multiclass Dataset"
            else:
                return "Binary Dataset"

        return self.isMassSpectrometryDataset

    def getClientPath(self):
        return self.clientPath
    
    def getMetrics(self):
        return self.actionsObject.metrics(self.clientPath, self.answers,self.normColumns,self.catColumns,self.encodedCatColumns,self.train_time)
        

    def mlAlgorithmsChoices(self, options):                                
        self.answers.append({'algorithms': options})
        self.steptsDict.append('algorithms')
        
        initial_time = time()
        self.actionsObject.set_algorithms(self.steptsDict, self.answers)
        self.actionsObject.train()
        final_time = time()
        self.train_time =  (final_time - initial_time)

    def getAlgorithmsQuestions(self):
        return getMlAlgorithmsQuestion()





