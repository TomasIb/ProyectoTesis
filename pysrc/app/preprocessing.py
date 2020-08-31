import sys
import pandas as pd
import numpy as np
from boruta import BorutaPy
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler,LabelEncoder,OneHotEncoder,Normalizer
from missingpy import MissForest
from sklearn.impute import KNNImputer
from  sklearn.pipeline import Pipeline
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_selection import RFECV
from sklearn.svm import SVC
import os,sys
import matplotlib.pyplot as plt
from joblib import parallel_backend


def warn(*args, **kwargs):
    pass
import warnings
warnings.warn = warn
warnings.filterwarnings("ignore", "(?s).*MATPLOTLIBDATA.*", category=UserWarning)
warnings.filterwarnings("ignore")
warnings.simplefilter(action='ignore', category=FutureWarning)
class Pipe():
    def __init__(self):
        steps_select = None,
        options = None
        answers=None
   

        X_train = None
        y_train = None

        X_test = None
        y_test = None

        headers = None 

        new_headers = None

        new_train_dataset = None
        new_test_dataset = None

        train_pipe_steps = None
        test_pipe_steps = None

        pipe = None

    def imputer(self,_steps,_answers,train_dataset,_X_train,_y_train,test_dataset,_X_test,_y_test,_headers):
        self.steps = _steps
        self.answers = _answers
        self.X_train = _X_train
        self.y_train = _y_train
        self.X_test = _X_test
        self.y_test = _y_test
        self.headers = _headers
        
        self.train_pipe_steps = []

        for i,s in enumerate(self.steps):
            if(s == 'imputer'):
                if(self.answers[i][s] == 'Miss Forest'):
                    imputer = MissForest()
                
                if(self.answers[i][s] == 'KNN Miss Values'):
                    
                    imputer = KNNImputer(n_neighbors=2)    
                                      
        imputer.fit(self.X_train,self.y_train)  
        self.X_train = imputer.transform(self.X_train)  
        self.X_test = imputer.transform(self.X_test)  

        
        self.new_train_dataset = pd.DataFrame(self.X_train,columns=self.headers[:-1])
        self.new_train_dataset[self.headers[-1]] = self.y_train    

        self.new_test_dataset = pd.DataFrame(self.X_test,columns=self.headers[:-1])
        self.new_test_dataset[self.headers[-1]] = self.y_test  
        
        return self.new_train_dataset,self.new_test_dataset


    def columnsTransformer(self,steps,answers,train_dataset,test_dataset,classes,normColumns,catColumns):
        self.steps = steps
        self.answers = answers      

        for i,s in enumerate(self.steps):            
            if(s == 'normalize'):                     
                if(self.answers[i][s] == 'Min Max Scaler'):                                                                            
                    scaler = MinMaxScaler()                
                    scaler.fit( train_dataset[normColumns])                
                    train_dataset[normColumns] = scaler.transform( train_dataset[normColumns])                
                    # test_dataset[normColumns] = scaler.transform( test_dataset[normColumns])   

                if(self.answers[i][s] == 'Standard Scaler'):
                    scaler = StandardScaler()
                    scaler.fit( train_dataset[normColumns])   
                    train_dataset[normColumns] = scaler.transform( train_dataset[normColumns])                
                    # test_dataset[normColumns] = scaler.transform( test_dataset[normColumns])  
                if(self.answers[i][s] == 'Normalizer'):
                    scaler = Normalizer()
                    scaler.fit( train_dataset[normColumns])   
                    train_dataset[normColumns] = scaler.transform( train_dataset[normColumns])                
                    # test_dataset[normColumns] = scaler.transform( test_dataset[normColumns])  
                if( self.answers[i][s] =='Do not normalize')    :
                    pass                                    
            

            if (s == 'encoder'):
                
                if(self.answers[i][s]   == 'Label Encoder'):
                    encoder = LabelEncoder()
                    selection = 'Label Encoder'
                elif(self.answers[i][s]   == 'One Hot Encoder'):
                    encoder = OneHotEncoder(sparse=False,categories='auto')
                    selection = 'One Hot Encoder'
                
                elif(self.answers[i][s]   == 'Do not encode'):
                    encoder = False
                    
      
        if(encoder != False):           
                if(len(catColumns) > 0 ):
                    for c in catColumns:
                        if selection == 'One Hot Encoder':
                            train_data = np.array(train_dataset[c]).reshape(-1,1)
                            test_data = np.array(test_dataset[c]).reshape(-1,1)

                            encoder.fit(train_data)
                            train_encoder_array = encoder.transform(train_data)                            
                            train_encoder_array = np.array(train_encoder_array)                            
                            train_dataset[c] = np.where(train_encoder_array==1)[1]     

                            test_encoder_array = encoder.transform(test_data)                            
                            test_encoder_array = np.array(test_encoder_array)                            
                            test_dataset[c] = np.where(test_encoder_array==1)[1]                            
                            
                        elif selection == 'Label Encoder':
                            train_data = train_dataset[c]
                            test_data = test_dataset[c]

                            encoder.fit(train_data)
                            train_dataset[c] = encoder.transform(train_data)
                            test_dataset[c] = encoder.transform(test_data)

                
                            
             
        return train_dataset,test_dataset
                

    def featureSelect(self,_steps,_options,train_dataset,_X,_y,_headers,path):
        
            self.steps = _steps
            self.options = _options
            self.X_train = _X
            self.y_train = _y                        
            self.headers = _headers
            self.train_pipe_steps = []            
            self.new_train_dataset = []            
            self.new_headers = self.headers[:-1]
            isRFECV = False

            for i,s in enumerate(self.steps):            
                if(s == 'feature_selector'):                    
                    if(self.options[i][s]['algorithm'] == 'Boruta'):
                        rf = RandomForestClassifier(n_jobs=-1, class_weight='balanced', max_depth=5)
                        ft = BorutaPy(rf, n_estimators='auto', verbose=10, random_state=1)
                        self.train_pipe_steps.append((s,ft))
                        
            
                    elif(self.options[i][s]['algorithm'] == 'Recursive Feature Elimination CV'):                                                
                        if (self.options[i][s]['estimator'] == 'Support Vector Machine'):
                            fitterModel = SVC(kernel="linear") 
                        elif(self.options[i][s]['estimator'] == 'Random Forest'):
                            fitterModel = RandomForestClassifier()   
                        with parallel_backend('multiprocessing', n_jobs=-1):                    
                            ft = RFECV(fitterModel, step=5, cv=StratifiedKFold(5),scoring='accuracy',verbose=10)                            
                        self.train_pipe_steps.append((s,ft))
                        isRFECV = True
                        print("Seleccionando atributos...")
                        

                    elif(self.options[i][s]['algorithm'] == 'Recursive Feature Elimination'):                        
                        ft = RFE(LogisticRegression(solver='liblinear', multi_class='auto')) # CUANTAS < a TOTAL
                        self.train_pipe_steps.append((s,ft))
                        
                    elif(self.options[i][s]['algorithm'] == 'Do not select'):
                        ft = False
                
            if(len(self.train_pipe_steps ) > 0):            
                self.train_pipe = Pipeline(self.train_pipe_steps)
                self.X_train = self.train_pipe.fit_transform(self.X_train,self.y_train)
            


                
        # if('feature_selector' in self.pipe_steps):
            if(ft != False):
                self.set_new_features()
            
            
            self.make_dataset()

            if(isRFECV):                
                plt.figure(figsize=(6.25,6.25))
                plt.xlabel("Nº Selected features")
                plt.ylabel("Cross Validation Score % Correct Clasifications)")
                plt.plot(range(1, len( self.train_pipe.named_steps['feature_selector'].grid_scores_) + 1),  self.train_pipe.named_steps['feature_selector'].grid_scores_)
                plt.savefig(path+'/RFECV_Plot.png', dpi=300, facecolor='w', edgecolor='w',
                    orientation='portrait', papertype=None, format=None,
                    transparent=False, bbox_inches=None, pad_inches=0.1)
    
            return self.new_train_dataset , self.new_headers 
    
    
        
    def set_new_features(self):
        self.new_headers = []
        for i in range(len(self.headers)-1):
            if self.train_pipe.named_steps['feature_selector'].support_[i]:
                self.new_headers.append(self.headers[i])
       
     

    def make_dataset(self):

        self.new_train_dataset = pd.DataFrame(self.X_train,columns=self.new_headers)
        self.new_train_dataset[self.headers[-1]] = self.y_train

        self.new_headers.append(self.headers[-1])
        
    
     




        




